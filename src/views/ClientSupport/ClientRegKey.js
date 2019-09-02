import React, { Component } from 'react';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientRegKeyDialog from './ClientRegKeyDialog';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ClientRegKey extends Component {
  
  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleSelectRow = (event, id) => {
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const viewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    ClientRegKeyActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientRegKeyDialog.TYPE_VIEW
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.ClientRegKeyActions.showDialog({
      viewItem: {
        regKeyNo: '',
        validDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        expireDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        ipRange: '',
        comment: '' 
      },
      dialogType: ClientRegKeyDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const viewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    ClientRegKeyActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientRegKeyDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeleteClientKey"),
      confirmMsg: t("msgDeleteClientKey", {regKeyNo: viewItem.get('regKeyNo')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientRegKeyActions.deleteClientRegKeyData({
        compId: compId,
        regKeyNo: confirmObject.get('regKeyNo')
      }).then(() => {
        ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientRegKeyActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientRegKeyProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    let columnHeaders = [
      { id: 'chRegKey', isOrder: true, numeric: false, disablePadding: true, label: t("colClientRegKey") },
      { id: 'chValidDate', isOrder: true, numeric: false, disablePadding: true, label: t("colKeyValidDate") },
      { id: 'chExpireDate', isOrder: true, numeric: false, disablePadding: true, label: t("colCertExpireDate") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") },
    ];

    const listObj = ClientRegKeyProps.getIn(['viewItems', compId]);
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
                keyId="regKeyNo"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let isEditable = true;
                  let isDeletable = true;

                  if(n.get('regKeyNo').endsWith('DEFAULT')) {
                    isEditable = false;
                    isDeletable = false;
                    if(window.gpmsain === Constants.SUPER_RULECODE) {
                      isEditable = true;
                      isDeletable = true;
                    }
                  } else if(n.get('regKeyNo').endsWith('STD')) {
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
                      onClick={event => this.handleSelectRow(event, n.get('regKeyNo'))}
                      key={n.get('regKeyNo')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('regKeyNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('validDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('expireDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.get('regKeyNo'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isDeletable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('regKeyNo'))}>
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
        <ClientRegKeyDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientRegKeyProps: state.ClientRegKeyModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientRegKey)));
