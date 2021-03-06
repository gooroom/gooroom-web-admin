import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import KeywordOption from "views/Options/KeywordOption";

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import { InlineDatePicker } from 'material-ui-pickers';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";


class AdminRecordListComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          fromDate: new Date().toJSON().slice(0,10),
          toDate: new Date().toJSON().slice(0,10),
          keyword: '',
          adminId: props.adminId,

          orderDir: 'desc',
          orderColumn: 'chActDt',
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: List([5, 10, 25]),
          rowsTotal: 0,
          rowsFiltered: 0
        }),
        checkedIds: List([])
      })
    };
  }

  handleGetDataList = (newListParam) => {

    requestPostAPI('readAdminRecordListPaged', {
      adminId: newListParam.get('adminId'),
      keyword: newListParam.get('keyword'),
      fromDate: newListParam.get('fromDate'),
      toDate: newListParam.get('toDate'),

      page: newListParam.get('page'),
      start: newListParam.get('page') * newListParam.get('rowsPerPage'),
      length: newListParam.get('rowsPerPage'),
      orderColumn: newListParam.get('orderColumn'),
      orderDir: newListParam.get('orderDir')
    }).then(
      (response) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = response.data;

        const { stateData } = this.state;
        this.setState({
          stateData: stateData
            .set('listData', List(data.map((e) => {return Map(e)})))
            .set('listParam', newListParam.merge({
              rowsFiltered: parseInt(recordsFiltered, 10),
              rowsTotal: parseInt(recordsTotal, 10),
              page: parseInt(draw, 10),
              rowsPerPage: parseInt(rowLength, 10),
              orderColumn: orderColumn,
              orderDir: orderDir
            }))
        });
      }
    ).catch(error => {
    });
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({ page: page });
    this.handleGetDataList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({ rowsPerPage: event.target.value, page: 0 });
    this.handleGetDataList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetDataList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
  };

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      keyword: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    // 아래 커멘트 제거시, 타이프 칠때마다 조회
    //this.handleGetDataList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetDataList(newListParam);
  };

  handleDateChange = (date, name) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      [name]: date.format('YYYY-MM-DD')
    });
    this.setState({
      stateData : stateData.set('listParam', newListParam)
    });
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'chActDt', isOrder: true, numeric: false, disablePadding: true, label: t("colDate") },
      { id: 'chActItem', isOrder: true, numeric: false, disablePadding: true, label: t("colReqJob") },
      { id: 'chActTp', isOrder: true, numeric: false, disablePadding: true, label: t("colJobType") },
      { id: 'chActData', isOrder: false, numeric: false, disablePadding: true, label: t("colDesc") },
      { id: 'chActUserId', isOrder: false, numeric: false, disablePadding: true, label: t("colId") }
    ];

    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    const { stateData } = this.state;

    return (
      <div>
        {/* data option area */}
        <Grid container spacing={16} alignItems="flex-end" direction="row" justify="space-between" >

          <Grid item xs={3}>
          <InlineDatePicker label={t('searchStartDate')} format='YYYY-MM-DD'
            value={(stateData.getIn(['listParam', 'fromDate'])) ? stateData.getIn(['listParam', 'fromDate']) : '1999-01-01'}
            onChange={(date) => {this.handleDateChange(date, 'fromDate');}} 
            className={classes.fullWidth} />
          </Grid>
          <Grid item xs={3}>
          <InlineDatePicker label={t('searchEndDate')} format='YYYY-MM-DD'
            value={(stateData.getIn(['listParam', 'toDate'])) ? stateData.getIn(['listParam', 'toDate']) : '1999-01-01'}
            onChange={(date) => {this.handleDateChange(date, 'toDate');}} 
            className={classes.fullWidth} />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search /> {t("btnSearch")}
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="logSeq"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {
              return (
                <TableRow
                  hover
                  onClick={event => this.handleSelectRow(event, n.get('logSeq'))}
                  key={n.get('logSeq')}
                >
                  <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('actDt'), 'YYYY-MM-DD')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('actItem')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('actTp')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} style={{width:440}}>{n.get('actData')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('actUserId')}</TableCell>
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
      </div>
    );

  }
}

export default translate("translations")(withStyles(GRCommonStyle)(AdminRecordListComp));

