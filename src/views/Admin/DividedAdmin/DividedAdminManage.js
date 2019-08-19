import React, { Component } from 'react';
import { Map, List, Iterable } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import DividedAdminManageDialog from './DividedAdminManageDialog';
import DividedAdminHistDialog from './DividedAdminHistDialog';
import DividedAdminManageSpec from './DividedAdminManageSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import CheckIcon from '@material-ui/icons/CheckCircleTwoTone';
import AddIcon from '@material-ui/icons/Add';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/Assignment';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DividedAdminManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,

      selectedAdminId: '',
      selectedAdminName: ''
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
  
  handleSelectRow = (event, id) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    const viewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');

    AdminUserActions.showInform({
      compId: compId,
      viewItem: viewItem
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

  render() {
    const { classes } = this.props;
    const { AdminUserProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

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
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={6} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={6} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} >
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
                  if(window.gpmsain !== Constants.SUPER_RULECODE && n.get('adminTp') !== Constants.PART_TYPECODE) {
                    isEditable = false;
                  }

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('adminId'))}
                      key={n.get('adminId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('adminId')}</TableCell>
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
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('adminId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isEditable && 
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
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManage)));
