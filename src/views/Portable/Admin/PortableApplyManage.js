import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ApplyActions from 'modules/PortableApplyModule';
import * as GRAlertActions from "modules/GRAlertModule";
import * as GRConfirmActions from "modules/GRConfirmModule";
import * as PortableCertActions from "modules/PortableCertModule";
import moment from "moment";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import { Grid, Button, Checkbox } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import KeywordOption from "views/Options/KeywordOption";
import ApplySearchSelect from './ApplySearchSelect';
import GRConfirm from "components/GRComponents/GRConfirm";
import InputPeriod from '../common/InputPeriod';
import ImagePathDetail from './ImagePathDetail';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EmptyList from '../common/EmptyList';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getDataObjectVariableInComp, setCheckedIdsInComp } from 'components/GRUtils/GRTableListUtils';
import { isNull, isEmpty, isUndefined } from 'components/GRUtils/GRValidationUtils';
import { getItemsExceptCreating } from 'components/GRUtils/GRPortableUtils';

import CertDetailDialog from '../common/CertDetailDialog';

import {
  PORTABLE_APPROVE,
  PORTABLE_APPROVE_STATUS_TYPE,
  PORTABLE_IMAGE_STATUS_TO_LOCALE,
  PORTABLE_IMAGE_STATUS_CODE,
} from 'components/GRComponents/GRPortableConstants';

class PortableApplyManage extends Component {
  constructor(props) {
    super(props);

    const { i18n } = this.props;

    this.state = {
      lang: i18n.language === 'kr' ? 'ko' : i18n.language,
      isCheckItemss: false,
    };
  }

  componentDidMount() {
    this.refreshListPaged();
  }

  refreshListPaged = (extParam) => {
    this.props.ApplyActions.readApplyListPaged(
      this.props.ApplyProps,
      extParam,
      {
        alertActions: this.props.GRAlertActions,
        compId: this.props.match.params.grMenuId,
        lang: this.state.lang
      });

    this.props.ApplyActions.reApproveStatus(this.props.match.params.grMenuId);
  }

  handleChangePage = (event, page) => {
    this.refreshListPaged({page: page});
  }

  handleChangeRowsPerPage = (event) => {
    this.refreshListPaged({
      rowsPerPage: event.target.value, page: 0
    });
  }

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.refreshListPaged({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  }

  handleClickPathDetail = (path) => {
    const { ApplyActions } = this.props;

    ApplyActions.openImagePathDetail(true, path);
  }

  handleClickAllCheck = (event, checked) => {
    const { ApplyActions, ApplyProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = getItemsExceptCreating(ApplyProps, compId, 'ptgrId', 'imageStatus', checked);

    ApplyActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  }

  handleClickCheck = (event, id) => {
    event.stopPropagation();

    const { ApplyActions, ApplyProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = setCheckedIdsInComp(ApplyProps, compId, id);  

    ApplyActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  }

  handleChangeApplySearchType = (value) => {
    this.props.ApplyActions.changeSearchType({
      name: 'searchType',
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleKeywordChange = (name, value) => {
    this.props.ApplyActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleSelectBtnClick = () => {
    this.refreshListPaged({page: 0});
  }

  handleDateChange = (date, isFromDate) => {
    const { ApplyActions, ApplyProps } = this.props;
    let param = {
      name: isFromDate ? 'fromDate' : 'toDate',
      value: formatDateToSimple(date, 'YYYY-MM-DD'),
      compId: this.props.match.params.grMenuId,
    }

    ApplyActions.changeSearchDate(ApplyProps, param);
  }

  handleClickApprove = (event, id) => {
    const { t } = this.props;
    const { ApplyActions, ApplyProps, GRConfirmActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    GRConfirmActions.showConfirm({
      confirmTitle: t('dtPortable'),
      confirmMsg: t('msgApproveConfirm'),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if (!confirmValue)
          return;

        ApplyActions.approvePortable(ApplyProps, id, compId)
        .then(res => {
          if (res && res.data.result === 'fail') {
            this.props.GRAlertActions.showAlert({
              alertTitle: this.props.t('dtSystemError'),
              alertMsg: res.data.message,
            });
          } else if (res && res.data.result === 'success') {
            this.props.GRAlertActions.showAlert({
              alertTitle: '',
              alertMsg: res.data.message,
            });

            this.refreshListPaged();
          }
        });
      }
    });
  }

  handleClickReApproveAll = () => {
    const { t } = this.props;
    const { ApplyActions, AdminProps, GRConfirmActions, ApplyProps } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: t('dtPortable'),
      confirmMsg: t('msgReApproveAllConfirm', {count: ApplyProps.get('reApproveCnt')}),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if (!confirmValue)
          return;

        ApplyActions.reApproveAllPortable(AdminProps.get('adminId'))
        .then(res => {
          if (res && res.data && res.data.result === 'fail') {
            this.props.GRAlertActions.showAlert({
              alertTitle: this.props.t('dtSystemError'),
              alertMsg: res.data.message,
            });
          } else if (res && res.data && res.data.result === 'success') {
            this.props.GRAlertActions.showAlert({
              alertTitle: '',
              alertMsg: res.data.message,
            });

            this.refreshListPaged({page: 0});
          }
        });
      }
    });
  }

  deletePortableInfo = (ids, isAll) => {
    const { t } = this.props;
    const { ApplyActions, ApplyProps, GRConfirmActions } = this.props;
    const compId = this.props.match.params.grMenuId;   

    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeletePortableInfo"),
      confirmMsg: isAll ?
        t("msgDeleteAllPortableConfirm", {count: ApplyProps.getIn(['viewItems', compId, 'listParam', 'rowsFiltered'])})
      :
        t("msgDeletePortableConfirm"),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if (!confirmValue)
          return;

        ApplyActions.deletePortable(ids)
        .then(res => {
          console.log('res: ', res);
          if (res && res.data && res.data.result === 'fail') {
            this.props.GRAlertActions.showAlert({
              alertTitle: this.props.t('dtSystemError'),
              alertMsg: res.data.message,
            });
          } else if (res && res.data && res.data.result === 'success') {
            this.props.GRAlertActions.showAlert({
              alertTitle: '',
              alertMsg: res.data.message,
            });

            this.refreshListPaged({page: 0});
          } 
        });
      }
    });
  }

  handleClickDelete = () => {
    const { ApplyProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const ids = ApplyProps.getIn(['viewItems', compId, 'checkedIds']);

    if ((isNull(ids) || isUndefined(ids) || isEmpty(ids)))
      return;

      this.deletePortableInfo(ids, false);
  }

  handleClickDeleteAll = () => {
    this.deletePortableInfo([], true);
  }

  isChecked = (compId, id) => {
    const { ApplyProps } = this.props;
    const checkedIds = getDataObjectVariableInComp(ApplyProps, compId, 'checkedIds');
    if(checkedIds)
      return checkedIds.includes(id);
    else
      return false;
  }

  handleOpenCertDialog = (certId, userId) => {
    this.props.PortableCertActions.openCertDialog(true, certId, userId);
  }

  render() {
    const { t, classes } = this.props;
    const { ApplyProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = ApplyProps.getIn(['viewItems', compId]);
    const checkableItems =  listObj && getItemsExceptCreating(ApplyProps, compId, 'ptgrId', 'imageStatus', true, false);
    const disableDelete = !listObj || !listObj.get('checkedIds') || listObj.get('checkedIds').size === 0;

    const now = moment(new Date().getTime('YYYY-MM-DD'));
    const fromDate = listObj && listObj.getIn(['listParam', 'fromDate']) ? listObj.getIn(['listParam', 'fromDate']) : now;
    const toDate = listObj && listObj.getIn(['listParam', 'toDate']) ? listObj.getIn(['listParam', 'toDate']) : now;

    let columnHeaders = [
      {id: "chCheckbox", isCheckbox: true},
      {id: "chUserId", isOrder: false, numeric: false, disablePadding: true, label: t("colUserId")},
      {id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate")},
      {id: "chExpireDate", isOrder: false, numeric: false, disablePadding: true, label: t("colExpireDate")},
      {id: "chCertStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colCertStatus")},
      {id: "chBuildStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colBuildStatus")},
      {id: "chImageName", isOrder: false, numeric: false, disablePadding: true, label: t("colImageName")},
      {id: "chImageUrl", isOrder: false, numeric: false, disablePadding: true, label: t("colImageUrl")},
      {id: "chImagePublish", isOrder: false, numeric: false, disablePadding: true, label: t("colImagePublish")},
      {id: "chApproveStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colApproveStatus")},
    ];

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between">
            <Grid item xs={8}>
              <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start">
                <Grid item>
                  <FormControl fullWidth={true}>
                    <ApplySearchSelect onChangeSelect={this.handleChangeApplySearchType}
                      value={listObj && listObj.getIn(['listParam', 'searchType']) ? listObj.getIn(['listParam', 'searchType']) : 'ALL'}
                    />
                  </FormControl>
                </Grid>
                {listObj && listObj.getIn(['listParam', 'searchType']) === 'chRegDate' ? 
                <Grid item>
                  <FormControl fullWidth={true}>
                    <InputPeriod
                      beginDate={fromDate}
                      endDate={toDate}
                      onDateChange={this.handleDateChange}
                    />
                  </FormControl>
                </Grid>
                :
                <Grid item>
                  <FormControl fullWidth={true}>
                    <KeywordOption
                      paramName="keyword"
                      keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()} 
                    />
                  </FormControl>
                </Grid>
                }
                <Grid item xs={2}>
                  <Button
                    className={classes.ptgrSearchButton}
                    variant="contained"
                    color="secondary"
                    onClick={ () => this.handleSelectBtnClick() }
                  >
                    {t("btnPtgrSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-end">
                <Grid item>
                  <Button
                    className={classes.ptgrReApproveAllButton}
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={ApplyProps.get('reApproveCnt') > 0 ? false : true}
                    onClick={this.handleClickReApproveAll}
                  >
                  {t("btnReApproveAll")}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.smallIconButton}
                    size="small"
                    onClick={this.handleClickDelete}
                    disabled={disableDelete}
                  >
                    <DeleteIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.ptgrDeleteAllButton}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={this.handleClickDeleteAll}
                  >
                    {t("btnDeleteAll")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {(listObj) &&
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="ptgrId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onClickAllCheck={this.handleClickAllCheck}
                checkedIds={listObj.get('checkedIds')}
                listData={checkableItems}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData') &&
                 listObj.get('listData').map(n => {
                  const isChecked = this.isChecked(compId, n.get('ptgrId'));
                  const regDate = formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD');
                  const expireDate = `${formatDateToSimple(n.get('beginDt'), 'YYYY-MM-DD')} ~ ${formatDateToSimple(n.get('expiredDt'), 'YYYY-MM-DD')}`;
                  const approveStatus = t(PORTABLE_APPROVE[n.get('approveStatus')]);
                  const imageStatus = t(PORTABLE_IMAGE_STATUS_TO_LOCALE[n.get('imageStatus')]);
                  const imageComplete = PORTABLE_IMAGE_STATUS_CODE[n.get('imageStatus')] === PORTABLE_IMAGE_STATUS_CODE.COMPLETE;
                  const imageCreating = PORTABLE_IMAGE_STATUS_CODE[n.get('imageStatus')] === PORTABLE_IMAGE_STATUS_CODE.CREATE;

                  return (
                    <TableRow
                      key={n.get('ptgrId')}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                          <Checkbox
                            checked={isChecked}
                            disabled={imageCreating}
                            color="primary"
                            className={classes.grObjInCell}
                            onClick={event => this.handleClickCheck(event, n.get('ptgrId'))}
                          />
                      </TableCell>
                      <TableCell className={classes.ptgrApplyTableRowUserId}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.ptgrApplyTableRowRegAt}>{regDate}</TableCell>
                      <TableCell className={classes.ptgrApplyTableRowUseAt}>{expireDate}</TableCell>
                      {n.get('certStatus') === 1 ?
                        <TableCell className={classes.ptgrApplyTableRowCert}>
                            <Button className={classes.ptgrImagePath} onClick={() => this.handleOpenCertDialog(n.get('certId'), n.get('userId'))}>
                              Y
                            </Button>
                        </TableCell>
                      :
                        <TableCell className={classes.ptgrApplyTableRowCert}>
                          N
                        </TableCell>
                      }
                      <TableCell className={classes.ptgrApplyTableRowBuildStatus}>{n.get('buildStatus') === 1 ? 'Y' : 'N'}</TableCell>
                      <TableCell className={classes.ptgrApplyTableRowIsoName}>
                        {imageComplete ?
                          n.get('imageName')
                        : null
                        }
                      </TableCell>
                      <TableCell className={classes.ptgrApplyTableRowIsoUrl}>
                        {imageComplete ?
                          <Button className={classes.ptgrImagePath} variant="contained" color="secondary" onClick={ () => this.handleClickPathDetail(n.get('imageUrl')) }>
                            {t('btnOpenImagePath')}
                          </Button>
                        : null
                        }
                      </TableCell>
                      <TableCell className={classes.ptgrApplyTableRowImageStatus}>
                        {imageStatus}
                      </TableCell>
                      <TableCell className={classes.ptgrApplyTableRowApprove}>
                        <React.Fragment>
                          {n.get('approveStatus') === 'APPROVE' ?
                            <div>{approveStatus}</div>
                          :
                            <Button
                              className={n.get('approveStatus') === PORTABLE_APPROVE_STATUS_TYPE.REQUEST
                                ? classes.ptgrApproveButton : classes.ptgrReApproveButton}
                              onClick={event => this.handleClickApprove(event, n.get('ptgrId'))}
                            >
                              {approveStatus}
                            </Button>
                          }
                          </React.Fragment>
                      </TableCell>
                    </TableRow>
                  )
                  })
                }
              </TableBody>
            </Table>
            {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
              <TablePagination
                component='div'
                count={listObj.getIn(['listParam', 'rowsFiltered'])}
                rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
                rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
                page={listObj.getIn(['listParam', 'page'])}
                backIconButtonProps={{
                  'aria-label': 'Previous Page'
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page'
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            }
            {listObj && listObj.get('listData') && listObj.get('listData').size === 0 &&
              <EmptyList />
            }
            </div>
          }
        </GRPane>
        <GRConfirm />
        <ImagePathDetail />
        <CertDetailDialog />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ApplyProps: state.PortableApplyModule,
  AdminProps: state.AdminModule,
});

const mapDispatchToProps = (dispatch) => ({
  ApplyActions: bindActionCreators(ApplyActions, dispatch),
  PortableCertActions: bindActionCreators(PortableCertActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableApplyManage)));