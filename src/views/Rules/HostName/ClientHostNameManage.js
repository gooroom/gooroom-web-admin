import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientHostNameDialog from './ClientHostNameDialog';
import ClientHostNameSpec from './ClientHostNameSpec';
import { generateClientHostNameObject } from './ClientHostNameSpec';

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


class ClientHostNameManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameListPaged(ClientHostNameProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameListPaged(ClientHostNameProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: page
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameListPaged(ClientHostNameProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameListPaged(ClientHostNameProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientHostNameActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const compId = this.props.match.params.grMenuId;
    const viewItem = getRowObjectById(ClientHostNameProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // ClientHostNameActions.showDialog({
    //   viewItem: viewItem,
    //   dialogType: ClientHostNameDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientHostNameActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
    
  };

  handleCreateButton = () => {
    this.props.ClientHostNameActions.showDialog({
      viewItem: Map(),
      dialogType: ClientHostNameDialog.TYPE_ADD
    });
  }

  handleEditListClick = (event, id) => { 
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    const viewItem = getRowObjectById(ClientHostNameProps, this.props.match.params.grMenuId, id, 'objId');

    ClientHostNameActions.showDialog({
      viewItem: generateClientHostNameObject(viewItem),
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { ClientHostNameProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    const viewItem = getRowObjectById(ClientHostNameProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteHosts"),
      confirmMsg: t("msgDeleteHosts", {objId: viewItem.get('objId')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientHostNameProps, ClientHostNameActions } = this.props;

      ClientHostNameActions.deleteClientHostNameData({
        objId: confirmObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(ClientHostNameProps, ClientHostNameActions.readClientHostNameListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientHostNameProps, compId, targetType);
    this.props.ClientHostNameActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientHostNameDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientHostNameProps, compId, targetType);
    this.props.ClientHostNameActions.showDialog({
      viewItem: generateClientHostNameObject(viewItem, false),
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientHostNameProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    const columnHeaders = [
      { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: t("colDivision") },
      { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleName") },
      { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleId") },
      { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: t("colModUser") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];

    const listObj = ClientHostNameProps.getIn(['viewItems', compId]);
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
                {listObj.get('listData') && listObj.get('listData').map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('objId'))}
                      key={n.get('objId')}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId').endsWith('DEFAULT') ? t("selBasic") : t("selOrdinary")}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                        <Button color='secondary' size="small" className={classes.buttonInTableRow} onClick={event => this.handleEditListClick(event, n.get('objId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                        { !n.get('objId').endsWith('DEFAULT') &&
                        <Button color='secondary' size="small" className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
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
        <ClientHostNameSpec compId={compId} specType="inform" hasAction={true}
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <ClientHostNameDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientHostNameManage)));
