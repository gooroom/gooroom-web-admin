import React, { Component, version } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

class ClientPackageSpecComp extends Component {
  componentDidMount() {
    this.props.ClientPackageActions.readpackageSpecListPagedInVersionCompare(this.props.ClientPackageProps, this.props.compId, {
      version1: '',
      version2: ''
    });
  }

  handleChangePage = (event, page) => {
    this.props.ClientPackageActions.readpackageSpecListPagedInVersionCompare(this.props.ClientPackageProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientPackageActions.readpackageSpecListPagedInVersionCompare(this.props.ClientPackageProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientPackageActions.readpackageSpecListPagedInVersionCompare(this.props.ClientPackageProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    ClientPackageActions.readpackageSpecListPagedInVersionCompare(ClientPackageProps, compId, { page: 0 });
  };

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
    const promise = new Promise(function (resolve, reject) {
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

  render() {
    const { classes } = this.props;
    const { ClientPackageProps, compId } = this.props;
    const { t, i18n } = this.props;

    const selectedVersion1 = ClientPackageProps.getIn(['viewItems', compId, 'listParam', 'version1']);
    const selectedVersion2 = ClientPackageProps.getIn(['viewItems', compId, 'listParam', 'version2']);
    const columnHeaders = [
      { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: t("colPackageName") },
      { id: "chV1Ver", isOrder: true, numeric: false, disablePadding: true, label: selectedVersion1 ? `${selectedVersion1} ${t("colVersion")}` : t("colVersion") },
      { id: "chV1License", isOrder: true, numeric: false, disablePadding: true, label: selectedVersion1 ? `${selectedVersion1} ${t("colLicense")}` : t("colLicense") },
      { id: "chV2Ver", isOrder: true, numeric: false, disablePadding: true, label: selectedVersion2 ? `${selectedVersion2} ${t("colVersion")}` : t("colVersion") },
      { id: "chV2License", isOrder: true, numeric: false, disablePadding: true, label: selectedVersion2 ? `${selectedVersion2} ${t("colLicense")}` : t("colLicense") }
    ];

    const listObj = ClientPackageProps.getIn(['viewItems', compId]);
    let emptyRows = 0;
    if (listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }
    return (
      <div>
        {/* data option area */}
        {listObj &&
          <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={2} >
              {t("btnCompareVer")}
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
              listData={listObj.get('listData')}
              columnData={columnHeaders}
            />
            <TableBody>
              {listObj.get('listData').map(n => {
                return (
                  <TableRow
                    hover
                    key={n.get('packageId')}
                  >
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('packageId')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('v1Ver')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('v1License')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('v2Ver')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('v2License')}</TableCell>
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
  ClientPackageProps: state.ClientPackageModule,
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageSpecComp)));
