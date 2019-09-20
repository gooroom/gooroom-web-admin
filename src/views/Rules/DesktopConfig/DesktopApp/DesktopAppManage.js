import React, { Component } from 'react';
import { Map, List } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import DesktopAppDialog from './DesktopAppDialog';
import DesktopAppSpec from './DesktopAppSpec';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopAppManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.DesktopAppActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }
  
  handleSelectRow = (event, id, isEditable) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(DesktopAppProps, compId, id, 'appId');

    // choice one from two views.

    // 1. popup dialog
    // DesktopAppActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: DesktopAppDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    DesktopAppActions.showInform({
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
    this.props.DesktopAppActions.showDialog({
      viewItem: Map({
        adminType: adminType
      }),
      dialogType: DesktopAppDialog.TYPE_ADD
    });
  }

  handleEditClick = (event, id) => { 
    const { DesktopAppProps, DesktopAppActions } = this.props;
    const viewItem = getRowObjectById(DesktopAppProps, this.props.match.params.grMenuId, id, 'appId');

    DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT_INAPP
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { DesktopAppProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(DesktopAppProps, this.props.match.params.grMenuId, id, 'appId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeleteDesktopApp"),
      confirmMsg: t("msgDeleteDesktopApp", {appId: viewItem.get('appId')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DesktopAppProps, DesktopAppActions } = this.props;
      DesktopAppActions.deleteDesktopAppData({
        appId: paramObject.get('appId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (viewItem) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_COPY
    });
  };

  handleClickEdit = (viewItem) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT_INAPP
    });
  };
  // ===================================================================

  handleEditListClick = (event, id) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    const viewItem = getRowObjectById(DesktopAppProps, this.props.match.params.grMenuId, id, 'appId');

    DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT_INAPP
    });
  };

  render() {
    const { classes } = this.props;
    const { DesktopAppProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    let columnHeaders = [
      { id: 'chAppId', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: 'chAppNm', isOrder: true, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'chAppInfo', isOrder: false, numeric: false, disablePadding: true, label: t("colInfo") },
      { id: 'chStatus', isOrder: false, numeric: false, disablePadding: true, label: t("colStatus") },
      { id: 'chModUser', isOrder: false, numeric: false, disablePadding: true, label: t("colModUser") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];

    const listObj = DesktopAppProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()} 
                    />
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
                keyId="appId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let isEditable = true;
                  let isDeletable = true;

                  if(n.get('appId').endsWith('DEFAULT')) {
                    isEditable = false;
                    isDeletable = false;
                    if(window.gpmsain === Constants.SUPER_RULECODE) {
                      isEditable = true;
                      isDeletable = true;
                    }
                  } else if(n.get('appId').endsWith('STD')) {
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
                      if(window.gpmsain === Constants.SUPER_RULECODE) {
                        isDeletable = true;
                      } else {
                        isDeletable = false;
                      }
                    }
                  }

                  return (
                    <TableRow 
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('appId'), isEditable)}
                      tabIndex={-1}
                      key={n.get('appId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appInfo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('status')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditListClick(event, n.get('appId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isDeletable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('appId'))}>
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
        </GRPane>
        {/* dialog(popup) component area */}
        <DesktopAppSpec compId={compId}
          specType="inform" 
          selectedItem={listObj}
          isEditable={(listObj) ? listObj.get('isEditable') : null}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        <DesktopAppDialog compId={compId} />
        <GRConfirm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopAppProps: state.DesktopAppModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppManage)));



