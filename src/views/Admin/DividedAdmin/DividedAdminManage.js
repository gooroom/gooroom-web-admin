import * as Constants from "components/GRComponents/GRConstants";
import { List, Map } from 'immutable';
import React, { Component } from 'react';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRPageHeader from 'containers/GRContent/GRPageHeader';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import AdminUserStatusSelect from "views/Options/AdminUserStatusSelect";

import GRPane from 'containers/GRContent/GRPane';
import DividedAdminHistDialog from './DividedAdminHistDialog';
import DividedAdminManageDialog from './DividedAdminManageDialog';
import DividedAdminManageSpec from './DividedAdminManageSpec';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';


import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import HistoryIcon from '@material-ui/icons/Assignment';
import CheckIcon from '@material-ui/icons/CheckCircleTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import LoginResetIcon from '@material-ui/icons/Flare';
import LockIcon from '@material-ui/icons/Lock';
import ReplayIcon from '@material-ui/icons/Replay';
import Search from '@material-ui/icons/Search';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

// option components
import AdminTypeSelect from 'views/Options/AdminTypeSelect';

import { Chip, Tooltip, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import { translate } from "react-i18next";
import { GRCommonStyle } from 'templates/styles/GRStyles';

class DividedAdminManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,

      selectedAdminId: '',
      selectedAdminName: '',

      selectedAdminType: 'ALL',
      selectedAdminStatus: 'ALL'
    };
  }
  
  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleSelectRow = (event, id, isEditable) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');

    AdminUserActions.showInform({
      compId: compId,
      viewItem: viewItem,
      isEditable: isEditable
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.AdminUserActions.showDialog({
      viewItem: Map({
        deptInfoList: List([]), 
        userInfoList: List([]), 
        grpInfoList: List([]), 
        clientInfoList: List([]),
        connIps: List(['*']),
        adminTp: (window.gpmsain === Constants.SUPER_RULECODE) ? 'A' : 'P'
      }),
      dialogType: DividedAdminManageDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    AdminUserActions.showDialog({
      viewItem: viewItem,
      dialogType: DividedAdminManageDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { AdminUserProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteAdminUser"),
      confirmMsg: t("msgDeleteAdminUser", {adminId: viewItem.get('adminId')}),
      confirmObject: viewItem,
      handleConfirmResult: (confirmValue, confirmObject) => {
        if(confirmValue) {
          const { AdminUserProps, AdminUserActions } = this.props;
          const compId = this.props.match.params.grMenuId;
          AdminUserActions.deleteAdminUserData({
            compId: compId,
            adminId: confirmObject.get('adminId')
          }).then(() => {
            AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
          });
        }
      }
    });
  };
  
  // show adming action history
  handleHistoryClick = (event, adminId) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, adminId, 'adminId');
    AdminUserActions.showHistDialog({
      viewItem: viewItem
    });
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.AdminUserActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleChangeAdminTypeSelect = (event, property) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      page:0, status: (this.state.selectedAdminStatus == 'ALL') ? '' : value, adminType: property
    });

    this.setState({
      selectedAdminType: property
    });
  };

  handleChangeAdminUserStatusSelect = (value) => {
    const { AdminUserProps, AdminUserActions, compId } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, { 
      page: 0, status: (value == 'ALL') ? '' : value, adminType: this.state.selectedAdminType
    });

    this.setState({
      selectedAdminStatus: value
    });
  }

  handleResetTrialCount = (viewItem, compId) => {
    const { UserProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
        confirmTitle: t("lbEditUserInfo"),
        confirmMsg: t("msgEditLoginTrialCount"),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { AdminProps, AdminUserActions, compId } = this.props;
            if(paramObject !== undefined) {
              AdminUserActions.resetLoginTrialCount({
                  adminId: paramObject.get('adminId')
              }).then((res) => {
                  if(res.status && res.status && res.status.message) {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemNotice"),
                      alertMsg: res.status.message
                    });
                  }
                  AdminUserActions.readUserListPaged(UserProps, compId);
                  this.handleClose();
              });
            }
          }
        },
        confirmObject: viewItem
    });
  }
  
  render() {
    const { classes } = this.props;
    const { AdminProps, AdminUserProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const getActionButton = (viewItem, compId) => {
      let actionButton = null;
      if(viewItem.get('loginTrial') < 1 || viewItem.get('otpLoginTrial') < 1) {
        actionButton = <div style={{width:200,paddingTop:10,display:'flex'}}>
          <Chip icon={<LockIcon style={{color: "#fafafa"}}/>} label={t("lbAccountLocked")} style={{color: "#fafafa", backgroundColor: "#d50000", marginRight:18}}/>
          <Tooltip title={t("ttResetLoginTrial")}>
            <Button size="small"
              variant="outlined" color="primary" style={{minWidth:32,marginRight:18}}
              onClick={() => this.handleResetTrialCount(viewItem, compId)}
            ><LoginResetIcon /></Button>
          </Tooltip>
        </div>
      } else {
        actionButton = <div style={{width:280,paddingTop:10}}>
          <ReplayIcon style={{verticalAlign: 'middle', marginRight:5}}/>
          <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:10}}>{t("lbAccountRemailTrial")}</Typography>
          <Typography style={{display: 'inline-block', marginRight:8}}>[{viewItem.get('loginTrial')+t("lbAccountPossibleCnt")}]</Typography>
          {/* <Button size="small"
            variant="outlined" color="primary" style={{minWidth:32}}
            onClick={() => this.handleClickEdit(viewItem, compId)}
          ><SettingsApplicationsIcon /></Button> */}
        </div>
      }
  
      return actionButton;
    }

    const columnHeaders = [
      { id: 'ch1', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: 'ch2', isOrder: true, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'ch200', isOrder: false, numeric: false, disablePadding: true, label: t("colType") },
      { id: 'ch201', isOrder: false, numeric: false, disablePadding: true, label: t("colStatus") },
      { id: 'createUser', isOrder: false, numeric: false, disablePadding: true, label: t("colCreateUser") },
      { id: 'ch101', isOrder: false, numeric: false, disablePadding: true, label: t("colTargetDept") },
      { id: 'ch102', isOrder: false, numeric: false, disablePadding: true, label: t("colTargetGroup") },
      { id: 'ch3', isOrder: false, numeric: false, disablePadding: true, label: t("colMngClient") },
      { id: 'ch4', isOrder: false, numeric: false, disablePadding: true, label: t("colMngUser") },
      { id: 'ch6', isOrder: false, numeric: false, disablePadding: true, label: t("colMngDesktop") },
      { id: 'ch7', isOrder: false, numeric: false, disablePadding: true, label: t("colMngNotify") },
      { id: 'ch8', isOrder: false, numeric: false, disablePadding: true, label: t("colMngPortable") },
      { id: 'ch99', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") },
      { id: 'ch90', isOrder: false, numeric: false, disablePadding: true, label: t("colActHistory") },
    ];

    const listObj = AdminUserProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}
          <Grid container spacing={24} alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={8} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={4} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()}  
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
                <Grid item xs={3} >
                  <FormControl fullWidth={true}>
                    <AdminTypeSelect onChangeSelect={this.handleChangeAdminTypeSelect} 
                      value={(listObj && listObj.getIn(['listParam', 'adminType'])) ? listObj.getIn(['listParam', 'adminType']) : 'ALL'}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} >
                  <FormControl fullWidth={true}>
                    <AdminUserStatusSelect onChangeSelect={this.handleChangeAdminUserStatusSelect} 
                      value={(listObj && listObj.getIn(['listParam', 'status'])) ? listObj.getIn(['listParam', 'status']) : 'ALL'}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />{t("btnRegist")}
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) &&
            <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="adminId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let isEditable = true;

                  // 2 depth ------------------------------------------
                  // SUPER : SUPER, ADMIN
                  // ADMIN : ADMIN, PART
                  // PART : NONE
                  // if(window.gpmsain === Constants.SUPER_RULECODE) {
                  //   if(n.get('adminTp') === Constants.PART_TYPECODE) {
                  //     isEditable = false;
                  //   }
                  // } else if(window.gpmsain === Constants.ADMIN_RULECODE) {
                  //   if(n.get('adminTp') === Constants.SUPER_TYPECODE) {
                  //     isEditable = false;
                  //   }
                  // }
                  // ---------------------------------------------------

                  // 3 depth -------------------------------------------
                  // SUPER : SUPER, ADMIN, PART
                  // ADMIN : ADMIN, PART
                  // PART : NONE
                  if(window.gpmsain === Constants.ADMIN_RULECODE) {
                    if(n.get('adminTp') === Constants.SUPER_TYPECODE) {
                      isEditable = false;
                    }
                  }
                  // ---------------------------------------------------

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('adminId'), isEditable)}
                      key={n.get('adminId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell} style={n.get('loginTrial') < 1 ? {color: "red"} : {}}>{n.get('adminId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('adminNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{
                        (n.get('adminTp') === Constants.SUPER_TYPECODE) ? t("lbTotalAdmin") : ((n.get('adminTp') === Constants.ADMIN_TYPECODE) ? t("lbSiteAdmin") : ((n.get('adminTp') === Constants.PART_TYPECODE) ? t("lbPartAdmin") : ''))
                      }</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('status')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCellAndBreak}>{
                        (n.get('deptInfoList').size > 0) ? ((n.get('deptInfoList').size > 1) ? n.getIn(['deptInfoList', 0, 'name']) + '+' : n.getIn(['deptInfoList', 0, 'name'])) : '-'
                      }</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCellAndBreak}>{
                        (n.get('grpInfoList').size > 0) ? ((n.get('grpInfoList').size > 1) ? n.getIn(['grpInfoList', 0, 'name']) + '+' : n.getIn(['grpInfoList', 0, 'name'])) : '-'
                      }</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('isClientAdmin') === '1') ? <CheckIcon /> : ''}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('isUserAdmin') === '1') ? <CheckIcon /> : ''}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('isDesktopAdmin') === '1') ? <CheckIcon /> : ''}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('isNoticeAdmin') === '1') ? <CheckIcon /> : ''}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('isPortableAdmin') === '1') ? <CheckIcon /> : ''}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable && n.get('status') !== '삭제' &&
                        <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('adminId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isEditable && n.get('status') !== '삭제' && AdminProps.get('adminId') !== n.get('adminId') &&
                        <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('adminId'))}>
                          <DeleteIcon />
                        </Button>
                      }
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                        <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                          onClick={event => this.handleHistoryClick(event, n.get('adminId'))}>
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
        <DividedAdminManageSpec compId={compId} specType="inform"
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          onClickEdit={(event, id) => this.handleEditClick(event, id)}
          getActionButton={getActionButton}
        />
        </GRPane>
        {/* dialog(popup) component area */}
        <DividedAdminManageDialog compId={compId} />
        <DividedAdminHistDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule,
  AdminUserProps: state.AdminUserModule,
  CommonOptionProps: state.CommonOptionModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManage)));
