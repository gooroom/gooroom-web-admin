import React, { Component } from "react";
import { Map, List } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { InlineDatePicker } from 'material-ui-pickers';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";


class DividedAdminHistList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          adminId: props.adminId,
          keyword: '',
          fromDate: '',
          toDate: '',
          orderDir: 'desc',
          orderColumn: 'LOG_SEQ',
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

  handleGetAdminHistList = (newListParam) => {
    requestPostAPI('readAdminActListPaged', {
      adminId: newListParam.get('adminId'),
      keyword: newListParam.get('keyword'),
      fromDate: newListParam.get('fromDate'),
      toDate: newListParam.get('toDate'),
      status: newListParam.get('status'),
      page: newListParam.get('page'),
      start: newListParam.get('page') * newListParam.get('rowsPerPage'),
      length: newListParam.get('rowsPerPage'),
      orderColumn: newListParam.get('orderColumn'),
      orderDir: newListParam.get('orderDir')
    }).then(
      (response) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir, extend } = response.data;
        let fromDate = '';
        let toDate = '';
        if(extend && extend.length) {
          extend.forEach(n => {
            if(n.name === 'fromDate') {
              fromDate = n.value;
            } else if(n.name === 'toDate') {
              toDate = n.value;
            }
          });
        }
        const { stateData } = this.state;
        this.setState({
          stateData: stateData
            .set('listData', List(data.map((e) => {return Map(e)})))
            .set('listParam', newListParam.merge({
              fromDate: fromDate,
              toDate: toDate,
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
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetAdminHistList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetAdminHistList(newListParam);
  };

  handleChangeSort = (columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetAdminHistList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
    const { stateData } = this.state;
    const checkedIds = stateData.get('checkedIds');
    let newCheckedIds = null;
    if(checkedIds) {
        const indexNo = checkedIds.indexOf(id);
        if(indexNo > -1) {
          newCheckedIds = checkedIds.delete(indexNo);
        } else {
          newCheckedIds = checkedIds.push(id);
        }
    } else {
      newCheckedIds = List([id]);
    }
    this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    this.props.onSelectClient(newCheckedIds);
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
    //this.handleGetAdminHistList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetAdminHistList(newListParam);
  };

  handleClickItem = (type, clientId) => {
    // this.props.onClickItem(type, clientId);
  }

  handleDateChange = (date, name) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      [name]: date.format('YYYY-MM-DD'),
      page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
  };
  
  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'logSeq', isOrder: false, numeric: false, disablePadding: true, label: t("colLogNo") },
      { id: 'logDate', isOrder: false, numeric: false, disablePadding: true, label: t("colLogDate") },
      { id: 'logType', isOrder: false, numeric: false, disablePadding: true, label: t("colLogType") },
      { id: 'accessIp', isOrder: false, numeric: false, disablePadding: true, label: t("colAccessIp") },
      { id: 'logItem', isOrder: false, numeric: false, disablePadding: true, label: t("colLogItem") },
      { id: 'logData', isOrder: false, numeric: false, disablePadding: true, label: t("colLogData") }
    ];

    const listObj = this.state.stateData;

    return (
      <div>
        {/* data option area */}
        <Grid container={true} spacing={8} alignItems="flex-end" direction="row" justify="space-between" >

          <Grid item xs={2} >
            <InlineDatePicker label={t('searchStartDate')} format='YYYY-MM-DD'
              value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
              onChange={(date) => {this.handleDateChange(date, 'fromDate');}} 
              className={classes.fullWidth} />
          </Grid>
          <Grid item xs={2} >
            <InlineDatePicker label={t('searchEndDate')} format='YYYY-MM-DD'
              value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
              onChange={(date) => {this.handleDateChange(date, 'toDate');}} 
              className={classes.fullWidth} />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={3}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="logDate"
            headFix={true}
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {
              let actLabel = '';
              switch (n.get('actTp')) {
                case 'R':
                    actLabel = 'Get';
                    break;
                case 'I':
                    actLabel = 'Create';
                    break;
                case 'U':
                    actLabel = 'Update';
                    break;
                case 'D':
                    actLabel = 'Delete';
                    break;
                case 'L':
                    actLabel = n.get('actItem');
                    break;
                default :
                    actLabel = n.get('actTp');
                    break;
              }

              return (
                <TableRow hover key={n.get('logSeq')} >
                  <TableCell className={classes.grSmallAndClickAndCenterCell} style={{minWidth:70}}>{n.get('logSeq')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} style={{minWidth:80}}>{formatDateToSimple(n.get('actDt'), 'YYYY-MM-DD')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} style={{minWidth:50}}>{actLabel}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} style={{minWidth:90}}>{n.get('accessIp')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} style={{minWidth:160}}>{n.get('actItem')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('actData')}</TableCell>
                </TableRow>
              );
            })}
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
          labelDisplayedRows={() => {return ''}}
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
      {/*<GRAlert /> */}
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminHistList)));

