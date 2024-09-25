import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from "react-i18next";

import { GRCommonStyle } from 'templates/styles/GRStyles';

import * as ClientPackageSpecActions from 'modules/ClientPackageSpecModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { getDataObjectVariableInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

class ClientPackageSpecComp extends Component {
  componentDidMount() {
    this.props.ClientPackageSpecActions.readPackageSpecListPagedInClient(this.props.ClientPackageSpecProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.ClientPackageSpecActions.readPackageSpecListPagedInClient(this.props.ClientPackageSpecProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientPackageSpecActions.readPackageSpecListPagedInClient(this.props.ClientPackageSpecProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientPackageSpecActions.readPackageSpecListPagedInClient(this.props.ClientPackageSpecProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleClickAllCheck = (event, checked) => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientPackageSpecProps, compId, 'packageId', checked);
    ClientPackageSpecActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    ClientPackageSpecActions.readPackageSpecListPagedInClient(ClientPackageSpecProps, compId, { page: 0 });
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientPackageSpecActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.compId
    });
  }

  handleValueChange = name => event => {
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    const { compId, ClientPackageSpecActions } = this.props;
    const promise = new Promise(function (resolve, reject) {
      ClientPackageSpecActions.changeListParamData({
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

  render() {
    const { classes } = this.props;
    const { ClientPackageSpecProps, compId } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: t("colPackageName") },     
      { id: "chInstallVer", isOrder: true, numeric: false, disablePadding: true, label: t("colInstalledVersion") },    
      { id: "chSpec", isOrder: true, numeric: false, disablePadding: true, label: t("colSwSpec") },
      { id: "chLicense", isOrder: true, numeric: false, disablePadding: true, label: t("colLicense") }
    ];

    const listObj = ClientPackageSpecProps.getIn(['viewItems', compId]);
    let emptyRows = 0;
    if (listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }
    const selectedClientId = ClientPackageSpecProps.getIn(['viewItems', compId, 'listParam', 'clientId']);

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
            <Grid item xs={5} >
              <FormControlLabel
                control={
                  <Switch onChange={this.handleValueChange('isFiltered')} color="primary" style={{ height: 24 }}
                    checked={(listObj.getIn(['listParam', 'isFiltered'])) ? listObj.getIn(['listParam', 'isFiltered']) : false} />
                }
                label={(listObj.getIn(['listParam', 'isFiltered'])) ? t("selShowDiffPackage") : t("selShowAllPackage")}
                labelPlacement="start"
                style={{ marginRight: 10 }}
              />
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
                return (
                  <TableRow                  
                    key={n.get('packageId')}
                  >
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('packageId')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('installVer')}</TableCell>               
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('spec')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('license')}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && ((Array.from(Array(emptyRows).keys())).map(e => {
                return (
                  <TableRow key={e}>
                    <TableCell
                      colSpan={columnHeaders.length + 1}
                      className={classes.grSmallAndClickCell}
                    />
                  </TableRow>
                )
              }))}
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
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientPackageSpecProps: state.ClientPackageSpecModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageSpecActions: bindActionCreators(ClientPackageSpecActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageSpecComp)));
