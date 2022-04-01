import React from 'react';

import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ImageActions from 'modules/PortableImageModule';
import * as GRAlertActions from 'modules/GRAlertModule';
import * as GRConfirmActions from "modules/GRConfirmModule";
import moment from "moment";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import { Grid, Button, Checkbox } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import KeywordOption from "views/Options/KeywordOption";
import Search from "@material-ui/icons/Search";
import ImageSearchSelect from './ImageSearchSelect';
import GRConfirm from "components/GRComponents/GRConfirm";
import InputPeriod from '../common/InputPeriod';
import EmptyList from '../common/EmptyList';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';
import { bytesToSize } from 'components/GRUtils/GRConvertUtils';
import { isNull, isEmpty, isUndefined } from 'components/GRUtils/GRValidationUtils'
import { getItemsExceptCreating } from 'components/GRUtils/GRPortableUtils';

import {
  PORTABLE_IMAGE_STATUS_TO_LOCALE,
  PORTABLE_IMAGE_STATUS_CODE,
} from 'components/GRComponents/GRPortableConstants';

class PortableImageManage extends React.Component {
  constructor(props) {
    super(props);

    const { i18n } = this.props;

    this.state = {
      lang: i18n.language === 'kr' ? 'ko' : i18n.language,
    };
  }

  componentDidMount() {
    this.refreshListPaged();
  }

  refreshListPaged = (extParam) => {
    this.props.ImageActions.readImageListPaged(
      this.props.ImageProps,
      extParam,
      {
        alertActions: this.props.GRAlertActions,
        compId: this.props.match.params.grMenuId,
        lang: this.state.lang
      }
    );
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

  handleClickAllCheck = (event, checked) => {
    const { ImageActions, ImageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = getItemsExceptCreating(ImageProps, compId, 'imageId', 'status', checked);

    ImageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleClickCheck(event, id) {
    event.stopPropagation();

    const { ImageActions, ImageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = setCheckedIdsInComp(ImageProps, compId, id);  

    ImageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  }

  handleChangeImageSearchType = (value) => {
    this.props.ImageActions.changeSearchType({
      name: 'searchType',
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleDateChange = (date, isFromDate) => {
    const { ImageActions, ImageProps } = this.props;
    let param = {
      name: isFromDate ? 'fromDate' : 'toDate',
      value: formatDateToSimple(date, 'YYYY-MM-DD'),
      compId: this.props.match.params.grMenuId,
    }

    ImageActions.changeSearchDate(ImageProps, param);
  }

  handleKeywordChange = (name, value) => {
    this.props.ImageActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleSelectBtnClick = () => {
    this.refreshListPaged({page: 0});
  }

  deleteImageInfo = (imageIds, isAll) => {
    const { t } = this.props;
    const { ImageActions, ImageProps, GRConfirmActions } = this.props;
    const compId = this.props.match.params.grMenuId;   

    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeleteImageInfo"),
      confirmMsg: isAll ?
        t("msgDeleteAllPortableConfirm", {count: ImageProps.getIn(['viewItems', compId, 'listParam', 'rowsFiltered'])})
      :
        t("msgDeletePortableConfirm"),
      handleConfirmResult: (confirmValue, confirmObject) => {
        if (!confirmValue)
          return;

        ImageActions.deleteImageInfo(imageIds)
          .then(res => {
          if (res.data && res.data.result === 'success') {
            this.props.GRAlertActions.showAlert({
              alertTitle: '',
              alertMsg: res.data.message,
            });

            this.refreshListPaged({page: 0});
          } else if (res.data && res.data.result === 'fail') {
            this.props.GRAlertActions.showAlert({
              alertTitle: this.props.t('dtSystemError'),
              alertMsg: res.data.message,
            });
          }
        });
      }
    });
  }

  handleClickDelete = () => {
    const { ImageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const ids = ImageProps.getIn(['viewItems', compId, 'checkedIds']);

    if (isNull(ids) || isUndefined(ids) || isEmpty(ids))
      return;

    this.deleteImageInfo(ids, false);
  }

  handleClickDeleteAll = () => {
    this.deleteImageInfo([], true);
  }

  isChecked = (compId, id) => {
    const { ImageProps } = this.props;
    const checkedIds = getDataObjectVariableInComp(ImageProps, compId, 'checkedIds');
    if(checkedIds)
      return checkedIds.includes(id);
    else
      return false;
  }

  render() {
    const { t, classes } = this.props;
    const { ImageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = ImageProps.getIn(['viewItems', compId]);
    const checkableItems =  listObj && getItemsExceptCreating(ImageProps, compId, 'imageId', 'status', true, false);
    const disableDelete = !listObj || !listObj.get('checkedIds') || listObj.get('checkedIds').size === 0;

    const now = moment(new Date().getTime('YYYY-MM-DD'));
    const fromDate = listObj && listObj.getIn(['listParam', 'fromDate']) ? listObj.getIn(['listParam', 'fromDate']) : now;
    const toDate = listObj && listObj.getIn(['listParam', 'toDate']) ? listObj.getIn(['listParam', 'toDate']) : now;

    let columnHeaders = [
      {id: "chCheckbox", isCheckbox: true},
      {id: "chUserId", isOrder: false, numeric: false, disablePadding: true, label: t("colUserId")},
      {id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate")},
      {id: "chImageName", isOrder: false, numeric: false, disablePadding: true, label: t("colImageName")},
      {id: "chCreateDate", isOrder: false, numeric: false, disablePadding: true, label: t("colImageCreatedDate")},
      {id: "chSize", isOrder: false, numeric: false, disablePadding: true, label: t("colImageSize")},
      {id: "chStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colImagePublish")},
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
                    <ImageSearchSelect onChangeSelect={this.handleChangeImageSearchType}
                      value={listObj && listObj.getIn(['listParam', 'searchType']) ? listObj.getIn(['listParam', 'searchType']) : 'ALL'}
                    />
                  </FormControl>
                </Grid>
                {listObj && (listObj.getIn(['listParam', 'searchType']) === 'chRegDate' ||
                listObj.getIn(['listParam', 'searchType']) === 'chCreateDate') ? 
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
                    {/* <Search /> */}{t("btnPtgrSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-end">
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
                keyId="imageId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onClickAllCheck={this.handleClickAllCheck}
                checkedIds={listObj.get('checkedIds')}
                listData={checkableItems}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData') && listObj.get('listData').map(n => {
                  const isChecked = this.isChecked(compId, n.get('imageId'));
                  const imageStatus = t(PORTABLE_IMAGE_STATUS_TO_LOCALE[n.get('status')]);
                  const isCreating = PORTABLE_IMAGE_STATUS_CODE[n.get('status')] === PORTABLE_IMAGE_STATUS_CODE.CREATE;
                  const isComplete = PORTABLE_IMAGE_STATUS_CODE[n.get('status')] === PORTABLE_IMAGE_STATUS_CODE.COMPLETE;

                  return (
                    <TableRow
                      className={''}
                      key={n.get('imageId')}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                          <Checkbox
                            checked={isChecked}
                            disabled={isCreating}
                            color="primary"
                            className={classes.grObjInCell}
                            onClick={event => this.handleClickCheck(event, n.get('imageId'))}
                          />
                      </TableCell>
                      <TableCell className={classes.ptgrImageTableRowUserId}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.ptgrImageTableRowRegAt}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.ptgrImageTableRowIsoName}>
                        {isComplete ?
                          n.get('name')
                        : null
                        }
                      </TableCell>
                      <TableCell className={classes.ptgrImageTableRowIsoCreatedAt}>
                        {isCreating ?
                          n.get('durationTime') === 0 ?
                            t("txWaiting")
                          :
                            t("txEstimate", {minutes: Math.ceil(n.get('durationTime') / 60000)})
                        :
                          isComplete ?
                            formatDateToSimple(n.get('createdDt'), 'YYYY-MM-DD HH:mm:ss')
                          : null
                        }
                      </TableCell>
                      <TableCell className={classes.ptgrImageTableRowIsoSize}>
                        {isComplete ?
                          bytesToSize(n.get('size'))
                        : null
                        }
                      </TableCell>
                      <TableCell className={classes.ptgrImageTableRowImageStatus}>{imageStatus}</TableCell>
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ImageProps: state.PortableImageModule,
  AdminProps: state.AdminModule,
});

const mapDispatchToProps = (dispatch) => ({
  ImageActions: bindActionCreators(ImageActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableImageManage)));