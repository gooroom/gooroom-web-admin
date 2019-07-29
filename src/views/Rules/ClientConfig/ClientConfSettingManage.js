import React, { Component } from 'react';
import { Map, List } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientConfSettingDialog from './ClientConfSettingDialog';
import ClientConfSettingSpec from './ClientConfSettingSpec';
import { generateClientConfSettingObject } from './ClientConfSettingSpec';

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
import AddIcon from '@material-ui/icons/Add';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ClientConfSettingManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientConfSettingActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }
  
  handleSelectRow = (event, id, isEditable) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const viewItem = getRowObjectById(ClientConfSettingProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // ClientConfSettingActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: ClientConfSettingDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientConfSettingActions.showInform({
      compId: compId,
      viewItem: viewItem,
      isEditable: isEditable
    });
    
  };

  handleCreateButton = () => {
    let adminType = 'A';
    if(window.gpmsain === Constants.SUPER_RULECODE) {
      adminType = 'S';
    }
    this.props.ClientConfSettingActions.showDialog({
      viewItem: Map({
        adminType: adminType,
        isDeleteLog: false,
        logRemainDate: '1',
        logMaxSize: 10000,
        logMaxCount: 3,
        systemKeepFree: 10,

        boot_minno: 0,
        os_minno: 0,
        exe_minno: 0,
        media_minno: 0,
        agent_minno: 0,

        notify_boot: 'err',
        show_boot: 'info',
        transmit_boot: 'info',

        notify_os: 'err',
        show_os: 'info',
        transmit_os: 'info',
        
        notify_exe: 'notice',
        show_exe: 'info',
        transmit_exe: 'info',
        
        notify_media: 'err',
        show_media: 'info',
        transmit_media: 'info',
        
        notify_agent: 'none',
        show_agent: 'info',
        transmit_agent: 'none',
        
        whiteIpAll: true
      }),
      dialogType: ClientConfSettingDialog.TYPE_ADD
    });
  }

  handleEditListClick = (event, id) => { 
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const viewItem = getRowObjectById(ClientConfSettingProps, this.props.match.params.grMenuId, id, 'objId');

    ClientConfSettingActions.showDialog({
      viewItem: generateClientConfSettingObject(viewItem, false, this.props.t),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { ClientConfSettingProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(ClientConfSettingProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + viewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
      ClientConfSettingActions.deleteClientConfSettingData({
        objId: confirmObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientConfSettingProps, compId, targetType);
    this.props.ClientConfSettingActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientConfSettingProps, compId, targetType);
    this.props.ClientConfSettingActions.showDialog({
      viewItem: generateClientConfSettingObject(viewItem, false, this.props.t),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps } = this.props;
    const { t, i18n } = this.props;

    const compId = this.props.match.params.grMenuId;

    const columnHeaders = [
      { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: t("colDivision") },
      { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleName") },
      { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleId") },
      { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: t("colModUser") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chRegUser', isOrder: true, numeric: false, disablePadding: true, label: t("colRegUser") },
      { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];

    const listObj = ClientConfSettingProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
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
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{textAlign:'right'}}>
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
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
                keyId="objId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let isEditable = true;
                  let isDeletable = true;

                  if(n.get('objId').endsWith('DEFAULT')) {
                    isDeletable = false;
                    if(window.gpmsain === Constants.SUPER_RULECODE) {
                      isEditable = true;
                    } else {
                      isEditable = false;
                    }
                  } else if(n.get('objId').endsWith('STD')) {
                    if(window.gpmsain === Constants.SUPER_RULECODE) {
                      isEditable = true;
                      isDeletable = true;
                    } else {
                      isEditable = false;
                      isDeletable = false;
                    }
                  } else {
                    if(this.props.AdminProps.get('adminId') === n.get('regUserId')) {
                      isEditable = true;
                      isDeletable = true;
                    } else {
                      isEditable = false;
                      isDeletable = false;
                    }
                  }

                  return (
                    <TableRow 
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('objId'), isEditable)}
                      key={n.get('objId')}
                      className={(n.get('objId').endsWith('DEFAULT')) ? classes.grDefaultRuleRow : ((n.get('objId').endsWith('STD')) ? classes.grStandardRuleRow : "")}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId').endsWith('DEFAULT') ? t("selBasic") : (n.get('objId').endsWith('STD') ? t("selStandard") : t("selOrdinary"))}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleEditListClick(event, n.get('objId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isDeletable &&
                        <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
                          <DeleteIcon />
                        </Button>
                      }
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
        {/* dialog(popup) component area */}
        <ClientConfSettingSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          isEditable={(listObj) ? listObj.get('isEditable') : null}
          hasAction={true}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <ClientConfSettingDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingManage)));



