import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientPackageDialog from './ClientPackageDialog';
import GRAlert from 'components/GRComponents/GRAlert';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from "@material-ui/core/Checkbox";

import Search from '@material-ui/icons/Search'; 

import AddPackageIcon from '@material-ui/icons/SaveAlt';
import DeletePackageIcon from '@material-ui/icons/RemoveCircle';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ClientPackageComp extends Component {

  componentDidMount() {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };
  

  // edit
  handleEditClick = (event, id) => {
    const { ClientPackageProps, ClientPackageActions, compId } = this.props;
    const viewItem = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    ClientPackageActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientPackageDialog.TYPE_EDIT
    });
  };
  
  handleClickAllCheck = (event, checked) => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientPackageProps, compId, 'packageId', checked);
    ClientPackageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    ClientPackageActions.readPackageListPagedInClient(ClientPackageProps, compId, {page: 0});
  };

  handleSelectRow = (event, id) => {
    const { ClientPackageProps, compId } = this.props;
    const { ClientPackageActions } = this.props;

    const selectRowObject = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    const newCheckedIds = setCheckedIdsInComp(ClientPackageProps, compId, id);

    ClientPackageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    if(this.props.onSelect) {
      this.props.onSelect(selectRowObject, newCheckedIds);
    }
  };  

  isChecked = id => {
    const { ClientPackageProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientPackageProps, compId, 'checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientPackageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleValueChange = name => event => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    const { compId, ClientPackageActions } = this.props;
    const promise = new Promise(function(resolve, reject) {
      ClientPackageActions.changeListParamData({
        name: name,
        value: value,
        compId: compId
      });
      resolve();
    });
    
    promise.then(() => {
      this.handleSelectBtnClick();
    });
  }

  isPackageSelected = () => {
    const checkedIds = this.props.ClientPackageProps.getIn(['viewItems', this.props.compId, 'checkedIds']);
    return !(checkedIds && checkedIds.size > 0);
  }

  handleUpdatePackage = () => {
    const checkedPackageIds = this.props.ClientPackageProps.getIn(['viewItems', this.props.compId, 'checkedIds']);
    const { t, i18n } = this.props;
    if(checkedPackageIds && checkedPackageIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtPackageUpdate"),
        confirmMsg: t("msgPackageUpdate", {packageCnt: checkedPackageIds.size}),
        handleConfirmResult: ((confirmValue, confirmObject) => {
          if(confirmValue) {
            this.props.ClientPackageActions.updatePackageInClient({
              clientIds: this.props.ClientPackageProps.getIn(['viewItems', this.props.compId, 'listParam', 'clientId']),
              packageIds: confirmObject.checkedPackageIds.join(',')
            }).then(() => {
              if(response && response.status && response.status.result === 'success') {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtPackageUpdate"),
                  alertMsg: t("msgCreatePkgUpdateJob")
                });
              } else {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtSystemError"),
                  alertMsg: t("msgNoCreatePkgUpdateJob")
                });
              }
            });
          }}),
        confirmObject: {checkedPackageIds: checkedPackageIds}
      });
    }
  }

  handleDeletePackage = () => {
    const checkedPackageIds = this.props.ClientPackageProps.getIn(['viewItems', this.props.compId, 'checkedIds']);
    const { t, i18n } = this.props;
    if(checkedPackageIds && checkedPackageIds.size > 0) {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("dtPackageDelete"),
        confirmMsg: t("msgPackageDelete", {packageCnt: checkedPackageIds.size}),
        handleConfirmResult: ((confirmValue, confirmObject) => {
          if(confirmValue) {
            this.props.ClientPackageActions.deletePackageInClient({
              clientIds: this.props.ClientPackageProps.getIn(['viewItems', this.props.compId, 'listParam', 'clientId']),
              packageIds: confirmObject.checkedPackageIds.join(',')
            }).then(() => {
              if(response && response.status && response.status.result === 'success') {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtPackageDelete"),
                  alertMsg: t("msgCreatePkgDeleteJob")
                });
              } else {
                this.props.GRAlertActions.showAlert({
                  alertTitle: t("dtSystemError"),
                  alertMsg: t("msgNoCreatePkgDeleteJob")
                });
              }              
            });
          }}),
        confirmObject: {checkedPackageIds: checkedPackageIds}
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageProps, compId } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: "chCheckbox", isCheckbox: true},
      { id: "chClientId", isOrder: true, numeric: false, disablePadding: true, label: t("colClientId") },
      { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: t("colPackageName") },
      { id: "chPackageArch", isOrder: true, numeric: false, disablePadding: true, label: t("colArchitecture") },
      { id: "chInstallVer", isOrder: true, numeric: false, disablePadding: true, label: t("colInstalledVersion") },
      { id: "chPackageLastVer", isOrder: true, numeric: false, disablePadding: true, label: t("colAvailVersion") }
    ];

    const listObj = ClientPackageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    const selectedClientId = ClientPackageProps.getIn(['viewItems', compId, 'listParam', 'clientId']);

    return (

      <div>
        {/* data option area */}
        {listObj &&
        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={2} >
            <FormControl fullWidth={true}>
              <TextField label={t("lbClientId")} value={(selectedClientId) ? selectedClientId : ""} />
            </FormControl>
          </Grid>
          <Grid item xs={3} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={2} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
          <Grid item xs={5} >
            <FormControlLabel
                control={
                <Switch onChange={this.handleValueChange('isFiltered')} color="primary" style={{height:24}}
                    checked={(listObj.getIn(['listParam', 'isFiltered'])) ? listObj.getIn(['listParam', 'isFiltered']) : false} />
                }
                label={(listObj.getIn(['listParam', 'isFiltered'])) ? t("selShowDiffPackage") : t("selShowAllPackage")}
                labelPlacement="start"
                style={{marginRight:10}}
            />
            <Tooltip title={t("ttPackageUpdate")}>
              <span>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleUpdatePackage} disabled={this.isPackageSelected()} style={{marginRight:10}}>
                  <AddPackageIcon />
                </Button>
              </span>
            </Tooltip>            
            <Tooltip title={t("ttPackageDelete")}>
              <span>
                <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleDeletePackage} disabled={this.isPackageSelected()} >
                  <DeletePackageIcon />
                </Button>
              </span>
            </Tooltip>            
          </Grid>
        </Grid>
        }
        {/* data area */}
        {listObj &&
          <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="packageId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onClickAllCheck={this.handleClickAllCheck}
            checkedIds={listObj.get('checkedIds')}
            listData={listObj.get('listData')}
            columnData={columnHeaders}
          />
          <TableBody>
          {listObj.get('listData').map(n => {
            const isChecked = this.isChecked(n.get('packageId'));
            return (
              <TableRow
                hover
                onClick={event => this.handleSelectRow(event, n.get('packageId'))}
                key={n.get('packageId')}
              >
                <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                  <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} />
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('packageId')}</TableCell>
                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('packageArch')}</TableCell>
                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('installVer')}</TableCell>
                <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('packageLastVer')}</TableCell>
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
        }
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
        <ClientPackageDialog compId={compId} />
        {/*<GRAlert /> */}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageComp)));


