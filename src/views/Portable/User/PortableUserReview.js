import React from 'react';

import { translate } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ListActions from 'modules/PortableUserReviewModule';
import * as GRAlertActions from "modules/GRAlertModule";
import * as GRConfirmActions from "modules/GRConfirmModule";
import * as PortableCertActions from "modules/PortableCertModule";

import moment from "moment";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';
import Typography from '@material-ui/core/Typography';
import { Grid, Button, Checkbox } from '@material-ui/core';
import KeywordOption from "views/Options/KeywordOption";
import Search from "@material-ui/icons/Search";
import FormControl from '@material-ui/core/FormControl';
import InputPeriod from '../common/InputPeriod';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import ListSearchSelect from './ListSearchSelect';
import CertDetailDialog from '../common/CertDetailDialog';
import EmptyList from '../common/EmptyList';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import {
  PORTABLE_IMAGE_STATUS,
  PORTABLE_IMAGE_STATUS_CODE,
  PORTABLE_IMAGE_STATUS_TO_LOCALE,
} from 'components/GRComponents/GRPortableConstants';

class PortableUserReview extends React.Component {
  constructor(props) {
    super(props);

    const { i18n } = this.props;

    this.state = {
      lang: i18n.language === 'kr' ? 'ko' : i18n.language,
    }
  }

  componentDidMount() {
    console.log('user review page');
    this.refreshListPaged();
  }

  refreshListPaged = (extParam) => {
    const { ListProps, ListActions } = this.props;

    ListActions.readApplyListPaged(
      ListProps,
      extParam,
      {
        //alertActions: GRAlertActions,
        compId: this.props.match.params.grMenuId,
        lang: this.state.lang,
      },
    );
  }

  handleChangeApplySearchType = (value) => {
    this.props.ListActions.changeSearchType({
      name: 'searchType',
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleKeywordChange = (name, value) => {
    this.props.ListActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleSelectBtnClick = () => {
    this.refreshListPaged({page: 0});
  }

  handleClickDownload = (downloadUrl) => {
    let element = document.createElement('a');
    element.setAttribute('href', downloadUrl);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  handleOpenCertDialog = (certId, userId) => {
    this.props.PortableCertActions.openCertDialog(true, certId, userId);
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

  handleChangeApplySearchType = (value) => {
    this.props.ListActions.changeSearchType({
      name: 'searchType',
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleKeywordChange = (name, value) => {
    this.props.ListActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.match.params.grMenuId,
    });
  }

  handleDateChange = (date, isFromDate) => {
    const { ListActions, ListProps } = this.props;
    let param = {
      name: isFromDate ? 'fromDate' : 'toDate',
      value: formatDateToSimple(date, 'YYYY-MM-DD'),
      compId: this.props.match.params.grMenuId,
    }

    ListActions.changeSearchDate(ListProps, param);
  }

  render() {
    const { t, classes } = this.props;
    const { ListProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = ListProps.getIn(['viewItems', compId]);
    const now = moment(new Date().getTime('YYYY-MM-DD'));
    const nowDate = formatDateToSimple(now, 'YYYY-MM-DD');
    const fromDate = listObj && listObj.getIn(['listParam', 'fromDate']) ? listObj.getIn(['listParam', 'fromDate']) : nowDate;
    const toDate = listObj && listObj.getIn(['listParam', 'toDate']) ? listObj.getIn(['listParam', 'toDate']) : nowDate;

    let columnHeaders = [
      {id: "chCheckbox", isCheckbox: false},
      {id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate")},
      {id: "chExpireDate", isOrder: false, numeric: false, disablePadding: true, label: t("colExpireDate")},
      {id: "chCertStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colCertStatus")},
      {id: "chBuildStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colBuildStatus")},
      {id: "chImageName", isOrder: false, numeric: false, disablePadding: true, label: t("colImageName")},
      {id: "chImageUrl", isOrder: false, numeric: false, disablePadding: true, label: t("colImageUrl")},
      {id: "chImagePublish", isOrder: false, numeric: false, disablePadding: true, label: t("colImagePublish")},
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
                    <ListSearchSelect onChangeSelect={this.handleChangeApplySearchType}
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
                listData={listObj.get('listData')}
                columnData={columnHeaders}
              />
              <TableBody>
                { listObj.get('listData') && listObj.get('listData').map(n => {
                  const regDate = formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD');
                  const expireDate = `${formatDateToSimple(n.get('beginDt'), 'YYYY-MM-DD')} ~ ${formatDateToSimple(n.get('expiredDt'), 'YYYY-MM-DD')}`;
                  const isExpired = moment(n.get('expiredDt')).isBefore(moment(nowDate));
                  const imageStatus = t(PORTABLE_IMAGE_STATUS_TO_LOCALE[n.get('imageStatus')]);
                  const imageStatusComplete = PORTABLE_IMAGE_STATUS_CODE[n.get('imageStatus')] === PORTABLE_IMAGE_STATUS_CODE.COMPLETE;

                  return (
                    <TableRow
                      key={n.get('imageId')}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                      </TableCell>
                      <TableCell className={classes.grSmallCenterCell}>{regDate}</TableCell>
                      <TableCell className={classes.grSmallCenterCell}>{expireDate}</TableCell>
                      {n.get('certStatus') === 1 ?
                        <TableCell className={classes.grSmallAndClickAndCenterCell}>
                            <Button className={classes.ptgrImagePath} onClick={() => this.handleOpenCertDialog(n.get('certId'), n.get('userId'))}>
                              Y
                            </Button>
                        </TableCell>
                      :
                        <TableCell className={classes.grSmallCenterCell}>
                          N
                        </TableCell>
                      }
                      <TableCell className={classes.grSmallCenterCell}>{n.get('buildStatus') === 1 ? 'Y' : 'N'}</TableCell>
                      <TableCell className={classes.grSmallCenterCell}>
                        {imageStatusComplete ?
                          n.get('imageName')
                        : null
                        }
                      </TableCell>
                      {imageStatusComplete ?
                        isExpired ?
                          <TableCell className={classes.grSmallCenterCell}>
                            <div
                              className={classes.ptgrExpiredImageDiv}
                            >
                              {t('btnExpire')}
                            </div>
                          </TableCell>
                        :
                          <TableCell className={classes.grSmallCenterCell}>
                            <Button
                              className={classes.ptgrDownloadImageButton}
                              variant="contained"
                              color="secondary"
                              onClick={ () => this.handleClickDownload(n.get('imageUrl')) }
                            >
                              {t('btnDownload')}
                            </Button>
                          </TableCell>
                      : null
                      }
                      <TableCell className={classes.grSmallCenterCell}>{imageStatus}</TableCell>
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
        <CertDetailDialog />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ListProps: state.PortableUserReviewModule,
});

const mapDispatchToProps = (dispatch) => ({
  ListActions: bindActionCreators(ListActions, dispatch),
  PortableCertActions: bindActionCreators(PortableCertActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PortableUserReview)));