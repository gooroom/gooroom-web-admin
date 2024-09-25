import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from "react-i18next";

import * as ClientPackageSpecActions from 'modules/ClientPackageSpecModule';
import * as ClientPackageVersionActions from 'modules/ClientPackageVersionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";
import { GRCommonStyle } from 'templates/styles/GRStyles';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

class PackageCompWithVersion extends Component {
  componentDidMount() {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId, ClientPackageVersionProps } = this.props;
  }

  handleChangePage = (event, page) => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    ClientPackageSpecActions.readpackageSpecListPagedInVersion(ClientPackageSpecProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    ClientPackageSpecActions.readpackageSpecListPagedInVersion(ClientPackageSpecProps, compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    ClientPackageSpecActions.readpackageSpecListPagedInVersion(ClientPackageSpecProps, compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientPackageSpecActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageSpecActions, ClientPackageSpecProps, compId } = this.props;
    ClientPackageSpecActions.readpackageSpecListPagedInVersion(ClientPackageSpecProps, compId, { page: 0 });
  };

  render() {
    const { classes } = this.props;
    const { ClientPackageSpecProps, ClientPackageVersionProps, compId } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'PACKAGE_ID', isOrder: true, numeric: false, disablePadding: true, label: t("colPackageName") },
      { id: 'LICENSE', isOrder: true, numeric: false, disablePadding: true, label: t("colLicense") },
      { id: 'SUPPLIER', isOrder: true, numeric: false, disablePadding: true, label: t("colSupplier") }
    ];

    const listObj = ClientPackageSpecProps.getIn(['viewItems', compId]);
    let emptyRows = 0;
    if (listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }
    const selectedVersionId = ClientPackageSpecProps.getIn(['viewItems', compId, 'listParam', 'version']);

    return (
      <div>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <TextField label={t("lbOsVersion")} value={(selectedVersionId) ? selectedVersionId : ""} />
            </FormControl>
          </Grid>
          <Grid item xs={4} >
            <KeywordOption paramName="keyword" keywordValue={(listObj && listObj.get('listParam')) ? listObj.getIn(['listParam', 'keyword']) : ''}
              handleKeywordChange={this.handleKeywordChange}
              handleSubmit={() => this.handleSelectBtnClick()} />
          </Grid>
          <Grid item xs={4} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
        </Grid>

        {/* data area */}
        {(listObj && listObj.get('listData')) &&
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
                    key={n.get('packageId')}
                  >
                    <TableCell className={classes.grSmallAndClickAnd}>{n.get('packageId')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('license')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('supplier')}</TableCell>
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
  ClientPackageSpecProps: state.ClientPackageSpecModule,
  ClientPackageVersionProps: state.ClientPackageVersionModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientPackageSpecActions: bindActionCreators(ClientPackageSpecActions, dispatch),
  ClientPackageVersionActions: bindActionCreators(ClientPackageVersionActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PackageCompWithVersion)));

