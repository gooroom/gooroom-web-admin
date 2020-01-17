import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyClientCountActions from 'modules/DailyClientCountModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getClientStatusIcon } from 'components/GRUtils/GRCommonUtils';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DailyClientCountSpec extends Component {

  handleChangePage = (event, page) => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    DailyClientCountActions.readClientCountListPaged(DailyClientCountProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    DailyClientCountActions.readClientCountListPaged(DailyClientCountProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    DailyClientCountActions.readClientCountListPaged(DailyClientCountProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    DailyClientCountActions.readClientCountListPaged(DailyClientCountProps, this.props.compId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyClientCountActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleParamChange = name => event => {
    this.props.DailyClientCountActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.compId
    });
  };


  render() {
    const { classes } = this.props;
    const { DailyClientCountProps } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: t("colClientId") },
      { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: t("colClientName") },
      { id: 'CLIENT_CNT', isOrder: false, numeric: true, disablePadding: true, label: t("colWorkCount") },
      { id: 'GRP_NM', isOrder: true, numeric: false, disablePadding: true, label: t("colClientGroup") },
      { id: 'STATUS_CD', isOrder: false, numeric: false, disablePadding: true, label: t("colStatus") }
    ];

    const compId = this.props.compId;
    
    const listObj = DailyClientCountProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
      <Paper style={{padding:16}}>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={2} >
            <TextField  label={t("optDate")} value={(listObj.getIn(['listParam', 'logDate'])) ? listObj.getIn(['listParam', 'logDate']) : ''} disabled={true} />
          </Grid>
          <Grid item xs={1} ></Grid>
          <Grid item xs={2} >
          <FormControl fullWidth={true}>
            <TextField label={t("optDivision")} value={(listObj.getIn(['listParam', 'searchType'])) ? ((listObj.getIn(['listParam', 'searchType']) === 'CREATE') ? t('regClientCount') : t('revokeClientCount')) : ''} disabled={true} />
          </FormControl>
          </Grid>
          <Grid item xs={1} ></Grid>
          <Grid item xs={2} >
            <KeywordOption paramName="keyword" keywordValue={(listObj.getIn(['listParam', 'keyword'])) ? listObj.getIn(['listParam', 'keyword']) : ''}
              handleKeywordChange={this.handleKeywordChange} 
              handleSubmit={() => this.handleSelectBtnClick()} />
          </Grid>
          <Grid item xs={1} ></Grid>
          <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
        </Grid>            

        {/* data area */}
        {listObj &&
          <Table>
            <GRCommonTableHead
              classes={classes}
              keyId="clientId"
              orderDir={listObj.getIn(['listParam', 'orderDir'])}
              orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
              onRequestSort={this.handleChangeSort}
              columnData={columnHeaders}
            />
            <TableBody>
              {listObj.get('listData') && listObj.get('listData').map(n => {
                return (
                  <TableRow hover key={n.get('clientId')} >
                    <TableCell className={classes.grSmallAndClick}>{n.get('clientId')}</TableCell>
                    <TableCell className={classes.grSmallAndClick}>{n.get('clientName')}</TableCell>
                    <TableCell className={classes.grSmallAndClick}>{n.get('clientCnt')}</TableCell>
                    <TableCell className={classes.grSmallAndClick}>{n.get('clientGroupName')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{getClientStatusIcon(n.get('viewStatus'))}</TableCell>
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
        <GRConfirm />
      </Paper>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DailyClientCountProps: state.DailyClientCountModule
});

const mapDispatchToProps = (dispatch) => ({
  DailyClientCountActions: bindActionCreators(DailyClientCountActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyClientCountSpec)));

