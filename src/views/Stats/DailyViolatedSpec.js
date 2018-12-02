import React, { Component } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyViolatedActions from 'modules/DailyViolatedModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

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

class DailyViolatedSpec extends Component {

  columnHeaders = [
    { id: 'LOG_SEQ', isOrder: false, numeric: false, disablePadding: true, label: '번호' },
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'USER_ID', isOrder: true, numeric: false, disablePadding: true, label: '사용자' },
    { id: 'LOG_TP', isOrder: true, numeric: false, disablePadding: true, label: '로그타입' },
    { id: 'LOG_VALUE', isOrder: true, numeric: false, disablePadding: true, label: '로그정보' },
    { id: 'REG_DT', isOrder: false, numeric: false, disablePadding: true, label: '등록일' }
  ];

  handleChangePage = (event, page) => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    DailyViolatedActions.readViolatedListPaged(DailyViolatedProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    DailyViolatedActions.readViolatedListPaged(DailyViolatedProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    DailyViolatedActions.readViolatedListPaged(DailyViolatedProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    DailyViolatedActions.readViolatedListPaged(DailyViolatedProps, this.props.compId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyViolatedActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleSelectRow = (event, id) => {
    const { DailyViolatedActions, DailyViolatedProps, compId } = this.props;
    const viewItem = getRowObjectById(DailyViolatedProps, compId, id, 'logSeq');
    DailyViolatedActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleParamChange = name => event => {
    this.props.DailyViolatedActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.compId
    });
  };


  render() {
    const { classes } = this.props;
    const { DailyViolatedProps } = this.props;
    const compId = this.props.compId;
    
    const listObj = DailyViolatedProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
      {(listObj && listObj.get('listData')) &&
      <Paper style={{padding:16}}>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={2} >
            <FormControl fullWidth={true}>
              <TextField label="날짜" value={listObj.getIn(['listParam', 'logDate'])} disabled={true} />
            </FormControl>
            </Grid>
            <Grid item xs={2} >
            <FormControl fullWidth={true}>
              <TextField label="침해구분" value={listObj.getIn(['listParam', 'violatedType'])} disabled={true} />
            </FormControl>
            </Grid>
            <Grid item xs={2} >
              <KeywordOption paramName="keyword" keywordValue={listObj.getIn(['listParam', 'keyword'])}
                handleKeywordChange={this.handleKeywordChange} 
                handleSubmit={() => this.handleSelectBtnClick()} />
            </Grid>
            <Grid item xs={5} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                <Search />조회
              </Button>
            </Grid>
          </Grid>            

          {/* data area */}
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="logSeq"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  return (
                    <TableRow hover key={n.get('logSeq')} >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('logSeq')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('userId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('logTp')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} style={{width:400}}>{(n.get('logValue')).substring(27)}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('logDate'), 'YYYY-MM-DD HH:mm:ss')}</TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
                  <TableRow key={e}>
                    <TableCell
                      colSpan={this.columnHeaders.length + 1}
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
        <GRConfirm />
      </Paper>
      }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DailyViolatedProps: state.DailyViolatedModule
});

const mapDispatchToProps = (dispatch) => ({
  DailyViolatedActions: bindActionCreators(DailyViolatedActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyViolatedSpec));

