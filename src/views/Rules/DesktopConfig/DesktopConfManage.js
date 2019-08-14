import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import DesktopConfDialog from './DesktopConfDialog';
import DesktopConfSpec from './DesktopConfSpec';
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

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


class DesktopConfManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    DesktopConfActions.readDesktopConfListPaged(DesktopConfProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    DesktopConfActions.readDesktopConfListPaged(DesktopConfProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    DesktopConfActions.readDesktopConfListPaged(DesktopConfProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    DesktopConfActions.readDesktopConfListPaged(DesktopConfProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DesktopConfActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(DesktopConfProps, compId, id, 'confId');

    // choice one from two views.

    // 1. popup dialog
    // DesktopConfActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: DesktopConfDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    DesktopConfActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleCreateButton = () => {
    const compId = this.props.match.params.grMenuId;

    // desktop app list for select
    //this.props.DesktopAppActions.readDesktopAppList(compId);
    // theme list for select option
    //this.props.DesktopConfActions.readThemeInfoList();
    this.props.DesktopConfActions.showDialog({
      viewItem: Map(),
      dialogType: DesktopConfDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { DesktopConfActions, DesktopConfProps } = this.props;
    const viewItem = getRowObjectById(DesktopConfProps, this.props.match.params.grMenuId, id, 'confId');

    DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { DesktopConfProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(DesktopConfProps, this.props.match.params.grMenuId, id, 'confId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeleteDesktopConf"),
      confirmMsg: t("msgDeleteDesktopConf", {confId: viewItem.get('confId')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DesktopConfActions, DesktopConfProps } = this.props;

      DesktopConfActions.deleteDesktopConfData({
        confId: paramObject.get('confId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(DesktopConfProps, DesktopConfActions.readDesktopConfListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { DesktopConfProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    const columnHeaders = [
      { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: t("colDivision") },
      { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'chThemeName', isOrder: true, numeric: false, disablePadding: true, label: t("colThemeName") },
      { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: t("colModUser") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chRegUser', isOrder: true, numeric: false, disablePadding: true, label: t("colRegUser") },
      { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];

    const listObj = DesktopConfProps.getIn(['viewItems', compId]);
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
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" 
                onClick={() => { this.handleCreateButton(); } } >
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
                keyId="confId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj && listObj.get('listData') && listObj.get('listData').map(n => {
                  return (
                    <TableRow 
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('confId'))}
                      tabIndex={-1}
                      key={n.get('confId')}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('confId').endsWith('DEFAULT') ? t("selBasic") : t("selOrdinary")}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('confId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('confNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('themeNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditListClick(event, n.get('confId'))}>
                          <SettingsApplicationsIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('confId'))}>
                          <DeleteIcon />
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
        {/* dialog(popup) component area */}
        <DesktopConfSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          hasAction={true}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <DesktopConfDialog compId={compId} isEnableDelete={true} />
        <DesktopAppDialog compId={compId} />
        <GRConfirm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopConfManage)));



