import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';

import * as UserReqActions from 'modules/UserReqModule';
import * as GRAlertActions from 'modules/GRAlertModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import KeywordOption from "views/Options/KeywordOption";

import GRPageHeader from "containers/GRContent/GRPageHeader";

import UserReqSpec from "views/User/UserReqSpec";
import UserReqHistDialog from "views/User/UserReqHistDialog";
import GRPane from "containers/GRContent/GRPane";
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import HistoryIcon from '@material-ui/icons/Assignment';
import AddBoxIcon from '@material-ui/icons/AddBox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserReqManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    this.props.UserReqActions.readUserReqListPaged(this.props.UserReqProps, this.props.match.params.grMenuId, {page: page});
  };

  handleChangeRowsPerPage = event => {
    this.props.UserReqActions.readUserReqListPaged(this.props.UserReqProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.UserReqActions.readUserReqListPaged(this.props.UserReqProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { UserReqProps, UserReqActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const selectRowObject = getRowObjectById(UserReqProps, compId, id, 'reqSeq');
    
    // show user inform pane.
    UserReqActions.showInform({ compId: compId, viewItem: selectRowObject });
  };

  handleKeywordChange = (name, value) => {
    this.props.UserReqActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectBtnClick = () => {
    const { UserReqActions, UserReqProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    UserReqActions.readUserReqListPaged(UserReqProps, compId, {page: 0});
    UserReqActions.getServerConf({ compId: compId });
  };

  handleApproveClick = (event, checkedIds) => {
    const { GRConfirmActions, UserReqProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: t("lbAdminCheckApprove"),
      confirmMsg: t("msgApproveUserRequest", {checkedIds: checkedIds.size}),
      handleConfirmResult: (confirmValue, paramObject) => {
        if(confirmValue) {
          const { UserReqActions, UserReqProps } = this.props;
          UserReqActions.approveUserReq({
            compId: compId,
            checkedIds: checkedIds
          }).then((res) => {
            if(res.status && res.status && res.status.message) {
              this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: res.status.message
              });
            }

            if(res.status && res.status && res.status.result === 'success') {
              UserReqActions.readUserReqListPaged(UserReqProps, compId, {page: 0});
            }
          });
        }
      }
    });
  }

  handleRejectClick = (event, checkedIds) => {
    const { GRConfirmActions, UserReqProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
      confirmTitle: t("lbAdminCheckDeny"),
      confirmMsg: t("msgDenyUserRequest", {checkedIds: checkedIds.size}),
      handleConfirmResult: (confirmValue, paramObject) => {
        if(confirmValue) {
          const { UserReqActions, UserReqProps } = this.props;
          UserReqActions.rejectUserReq({
            compId: compId,
            checkedIds: checkedIds
          }).then((res) => {
            if(res.status && res.status && res.status.message) {
              this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: res.status.message
              });
            }

            if(res.status && res.status && res.status.result === 'success') {
              UserReqActions.readUserReqListPaged(UserReqProps, compId, {page: 0});
            }
          });
        }
      }
    });
  }

  // show request action history
  handleHistoryClick = (event, reqSeq) => {
    const { UserReqActions, UserReqProps } = this.props;
    const viewItem = getRowObjectById(UserReqProps, this.props.match.params.grMenuId, reqSeq, 'reqSeq');
    UserReqActions.showHistDialog({
      viewItem: viewItem
    });
  };

  handleClickAllCheck = (event, checked) => {
    const { UserReqActions, UserReqProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = getDataPropertyInCompByParam(UserReqProps, compId, 'reqSeq', checked, true);

    UserReqActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { UserReqActions, UserReqProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const newCheckedIds = setCheckedIdsInComp(UserReqProps, compId, id);  

    UserReqActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

  }

  isChecked = id => {
    const { UserReqProps } = this.props;
    const checkedIds = getDataObjectVariableInComp(UserReqProps, this.props.match.params.grMenuId, 'checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { UserReqProps } = this.props;
    const selectId = getDataObjectVariableInComp(UserReqProps, this.props.match.params.grMenuId, 'selectId');
    return (selectId == id);
  }

  render() {
    const { classes } = this.props;
    const { UserReqProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    const columnHeaders = [
      { id: "chCheckbox", isCheckbox: true},
      { id: "chReqSeq", isOrder: true, numeric: false, disablePadding: true, label: t("colReqSeq") },
      { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: t("colReqUserId") },
      { id: "chUsbName", isOrder: false, numeric: false, disablePadding: true, label: t("colUsbName") },
      { id: "chUsbSerialNo", isOrder: false, numeric: false, disablePadding: true, label: t("colUsbSerial") },
      { id: "chReqDate", isOrder: true, numeric: false, disablePadding: true, label: t("colReqDate") },
      { id: "chActionType", isOrder: true, numeric: false, disablePadding: true, label: t("colReqType") },
      { id: 'chAction', isOrder: true, numeric: false, disablePadding: true, label: t("colAdminChk") },
      { id: 'chHistory', isOrder: false, numeric: false, disablePadding: true, label: t("colReqHistory") }
    ];
    
    const listObj = UserReqProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    const serverConf = UserReqProps.getIn(['viewItems', compId, 'listParam', 'serverConf']);
    const checkedIds = getDataObjectVariableInComp(UserReqProps, compId, 'checkedIds');
    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}
          {(serverConf) &&
            <Card>
              <CardContent>
                <Grid container spacing={16}>
                  <Grid item xs={12} md={12} lg={4} xl={4} >
                    <AddBoxIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                    <Typography variant="subtitle2" style={{display: 'inline-block'}}>{t('lbSetLimitCnt')} [ {serverConf.maxMediaCnt} ]</Typography>
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} xl={4} >
                    <CheckCircleIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                    <Typography variant="subtitle2" style={{display: 'inline-block', marginRight:5}}>
                      {t('lbHowToApproveReq')} [ {(serverConf.registerReq == '1') ? t("lbAutomatic") : t("lbManual")} ]
                    </Typography>
                    {/* <FormControlLabel
                        control={<Switch checked={serverConf.registerReq === '1'} color="primary"/>}
                      label={(serverConf.registerReq == '1') ? t("lbAutomatic") : t("lbManual")}
                    /> */}
                  </Grid>
                  <Grid item xs={12} md={12} lg={4} xl={4} >
                    <ErrorIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                    <Typography variant="subtitle2" style={{display: 'inline-block', marginRight:5}}>
                      {t('lbHowToDeleteReq')} [ {(serverConf.deleteReq == '1') ? t("lbAutomatic") : t("lbManual")} ]
                    </Typography>
                    {/* <FormControlLabel 
                        control={<Switch checked={serverConf.deleteReq === '1'} color="primary" />}
                      label={(serverConf.deleteReq == '1') ? t("lbAutomatic") : t("lbManual")}
                    /> */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          }
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={4}>
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {checkedIds && checkedIds.size > 0 &&
            <Grid item xs={2} >
              <Button className={classes.GRIconSmallButton} size="medium" variant="contained" 
                style={{backgroundColor: green[400], marginRight: 10}} onClick={(e) => this.handleApproveClick(e, checkedIds) } >
                {t("btnApprove")}
              </Button>
              <Button className={classes.GRIconSmallButton} size="medium" variant="contained" 
                style={{backgroundColor: red[500]}} onClick={(e) => this.handleRejectClick(e, checkedIds) } >
                {t("btnDeny")}
              </Button>
            </Grid>
            }
          </Grid>

          {/* data area */}
          {(listObj) && 
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="reqSeq"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                isDisableAllCheck={listObj.get('listData').filter(n => n.get("adminCheck") === 'waiting').size < 1}
                onClickAllCheck={this.handleClickAllCheck}
                checkedIds={listObj.get('checkedIds')}
                listData={listObj.get('listData')}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  const isChecked = this.isChecked(n.get('reqSeq'));
                  const isSelected = this.isSelected(n.get('reqSeq'));
                  return (
                    <TableRow
                      hover
                      className={(isSelected) ? classes.grSelectedRow : ''}
                      onClick={event => this.handleSelectRow(event, n.get('reqSeq'))}
                      role="checkbox"
                      key={n.get('reqSeq')}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                        {n.get("adminCheck") === 'waiting' &&
                        <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('reqSeq'))}/>
                        } 
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('reqSeq')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('usbName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('usbSerialNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                        {(n.get('actionType') === 'registering') ? t("lbRegister") : t("lbUnregister")}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {(n.get('adminCheck') === 'waiting') &&
                        <React.Fragment>
                          <Tooltip title={t('lbApprove')}>
                          <Button color="secondary" size="small" 
                            className={classes.buttonInTableRow}
                            onClick={event => this.handleApproveClick(event, List([n.get('reqSeq')]))}>
                            <CheckIcon style={{color: green[400]}}/>
                          </Button>
                          </Tooltip>
                          <Tooltip title={t('lbDeny')}>
                          <Button color="secondary" size="small" 
                            className={classes.buttonInTableRow}
                            onClick={event => this.handleRejectClick(event, List([n.get('reqSeq')]))}>
                            <ClearIcon style={{color: red[500]}}/>
                          </Button>
                          </Tooltip>
                        </React.Fragment>
                      }
                      {(n.get('adminCheck').endsWith('approval')) &&
                        t("lbApprove")
                      }
                      {(n.get('adminCheck').endsWith('deny')) && 
                        t("lbDeny")
                      }
                      {(n.get('adminCheck').endsWith('cancel')) && 
                        t("lbRevokeAuth")
                      }
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                        <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                          onClick={event => this.handleHistoryClick(event, n.get('reqSeq'))}>
                          <HistoryIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
                  <TableRow key={e}>
                    <TableCell
                      colSpan={columnHeaders.length + 1}
                      className={classes.grSmallAndClickCell}
                    />
                  </TableRow>
                )}))}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={listObj.getIn(['listParam', 'rowsFiltered'])}
              rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
              rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
              page={listObj.getIn(['listParam', 'page'])}
              labelDisplayedRows={() => {return ''}}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </div>
          }
        </GRPane>
        <UserReqSpec compId={compId} />
        <UserReqHistDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  UserReqProps: state.UserReqModule
});

const mapDispatchToProps = (dispatch) => ({
  UserReqActions: bindActionCreators(UserReqActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserReqManage)));

