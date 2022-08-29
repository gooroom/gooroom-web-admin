import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import KeywordOption from "views/Options/KeywordOption";

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import ActivateGroupStatusSelect from "views/Options/ActivateGroupStatusSelect";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";

import { InlineDatePicker } from 'material-ui-pickers';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as GRAlertActions from "modules/GRAlertModule";


class DeptActivateList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          status: 'STAT010',
          keyword: '',
          objectId: props.objId,
          orderDir: 'asc',
          orderColumn: 'chUserNm',
          page: 0,
          rowsPerPage: 5,
          rowsPerPageOptions: List([5, 10]),
          rowsTotal: 0,
          rowsFiltered: 0
        })
      }),
      searchType:'all'
    };
  }

  handleGetActivateList = (newListParam) => {
    const date = formatDateToSimple (new Date(), 'YYYY-MM-DD');
    requestPostAPI('readActivateGroupList', {
      deptCd: newListParam.get('deptCd'),
      objectId: newListParam.get('objectId'),
      gubun: newListParam.get('gubun'),
      keyword: newListParam.get('keyword'),
      toDate: newListParam.get('toDate') ? newListParam.get('toDate') : date,
      fromDate: newListParam.get('fromDate') ? newListParam.get('fromDate') : date,
      status: newListParam.get('status'),
      page: newListParam.get('page'),
      draw: newListParam.get('page'),
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
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetActivateList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetActivateList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetActivateList(newListParam);
  };

  handleChangeActivateGroupStatusSelect = (value) => {
    const { stateData } = this.state;
   
    const newListParam = (stateData.get('listParam')).merge({
      gubun: (value == 'all') ? '' : value, 
      page: 0
    });

    this.setState({
      keyword: '',
      searchType: value,
      stateData: stateData.set('listParam', newListParam)
    });

    this.handleGetActivateList(newListParam);
  }

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      keyword: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
  }

    handleDateChange = (name, otherDate) => event => {
    const { stateData } = this.state;

    let toDate, fromDate;
    if (name == 'fromDate') {
        toDate  = new Date(otherDate);
        fromDate = event._d;
    }
    else {
        toDate  = event._d;
        fromDate = new Date(otherDate);
    }

    if (fromDate > toDate) {
      this.props.GRAlertActions.showAlert({
        alertTitle: this.props.t("dtDateError"),
        alertMsg: this.props.t("msgDateError")
      });
      event._d = new Date (event._i);
      return;
    }

    let newListParam = (stateData.get('listParam')).merge({
      [name]: formatDateToSimple (event._d, 'YYYY-MM-DD'),
      page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });

    this.handleGetActivateList(newListParam);
  };

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetActivateList(newListParam);
  };

  setDefaultDate = (date) => {
    const { stateData } = this.state;
    let newListParam = (stateData.get('listParam')).merge({
      fromDate: date,
      toDate: date,
      page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
  };

  // .................................................

  render() {
    const { classes, checkedUser } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'chCategory', isOrder: false, numeric: false, disablePadding: true, label: t("colCategory") },
      { id: 'chName', isOrder: false, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'chId', isOrder: false, numeric: false, disablePadding: true, label: t("colId") },     
      { id: 'chRuleModDate', isOrder: false, numeric: false, disablePadding: true, label: t("colRuleModDate") }     
    ];
   
    const listObj = this.state.stateData;
    const searchType = this.state.searchType;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    const date = formatDateToSimple (new Date(), 'YYYY-MM-DD');
    if (listObj) {
      const fromDate = listObj.getIn(['listParam', 'fromDate']);
      const toDate = listObj.getIn(['listParam', 'toDate']);
      if (fromDate === undefined && 
          toDate === undefined) {
          this.setDefaultDate (date);
      }
    }
    return (
      <div>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" style={{flexWrap:"inherit"}} >
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <ActivateGroupStatusSelect onChangeSelect={this.handleChangeActivateGroupStatusSelect}
                value={searchType}/>
            </FormControl>
          </Grid>
          {
          searchType !== 'date' ?
          <Grid container alignItems="flex-end" style={{display:'contents'}} >
            <Grid item xs={4} style={{paddingLeft:20}} >
              <FormControl fullWidth={true}>
                <KeywordOption paramName="keyword" 
                  handleKeywordChange={this.handleKeywordChange} 
                  handleSubmit={() => this.handleSelectBtnClick()} />
              </FormControl>
            </Grid> 
            <Grid item xs={4} style={{paddingLeft:10,paddingRight:20,textAlign:'right'}} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                <Search />{t("btnSearch")}
              </Button>
            </Grid>
          </Grid> 
          :
          <Grid container alignItems="flex-end" style={{display:'contents'}} >
            <Grid item xs={4} style={{paddingLeft:20}} >
              <InlineDatePicker label={t('searchStartDate')} format='YYYY-MM-DD'
                value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : date}
                onChange={this.handleDateChange('fromDate', listObj.getIn(['listParam', 'toDate']))} 
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} >
              <InlineDatePicker label={t('searchEndDate')} format='YYYY-MM-DD'
                value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : date}
                onChange={this.handleDateChange('toDate', listObj.getIn(['listParam', 'fromDate']))} 
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} style={{textAlign:'right'}} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                <Search />{t("btnSearch")}
              </Button>
            </Grid>
          </Grid>
          }
       </Grid>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="userId"
            listData={listObj.get('listData')}
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map((n, index)  => {
              return (
                <TableRow
                  hover
                  key={index}
                  sytle={{textAlign:'center'}}
                >
                  <TableCell className={classes.grSmallAndClickCell}>
                  {
                    n.get('gunbun') === '그룹' ? t('lbClient') :  t('lbUser')
                  }
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptCd')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('regDt')}</TableCell>
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
      </div>
    );
  }
}


const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(GRCommonStyle)(DeptActivateList))
);

