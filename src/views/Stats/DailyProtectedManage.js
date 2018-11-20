import React, { Component } from 'react';
import { Map, List } from 'immutable';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyProtectedActions from 'modules/DailyProtectedModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import DailyProtectedDialog from './DailyProtectedDialog';
import DailyProtectedSpec from './DailyProtectedSpec';
import { generateDailyProtectedObject } from './DailyProtectedSpec';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DailyProtectedManage extends Component {

  columnHeaders = [
    { id: 'logDate', isOrder: false, numeric: false, disablePadding: true, label: '날짜' },
    { id: 'boot', isOrder: false, numeric: false, disablePadding: true, label: '부팅보안침해' },
    { id: 'exe', isOrder: false, numeric: false, disablePadding: true, label: '실행보안침해' },
    { id: 'os', isOrder: false, numeric: false, disablePadding: true, label: 'OS보안침해' },
    { id: 'media', isOrder: false, numeric: false, disablePadding: true, label: '매체보안침해' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    DailyProtectedActions.readDailyProtectedList(DailyProtectedProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyProtectedActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { DailyProtectedActions, DailyProtectedProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(DailyProtectedProps, compId, id, 'logSeq');

    // choice one from two views.

    // 1. popup dialog
    // DailyProtectedActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: DailyProtectedDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    DailyProtectedActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
  };

  handleParamChange = name => event => {
    this.props.DailyProtectedActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };


  render() {
    const { classes } = this.props;
    const { DailyProtectedProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = DailyProtectedProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    let data = [];
    if(listObj && listObj.get('listAllData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listAllData').size;
      data = listObj.get('listAllData').toJS().map((e) => {
        e.logDate = formatDateToSimple(e.logDate, 'MM/DD');
        return e;
      });
    }

    const __data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];

    return (
      <div>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={3} >
            <TextField label="조회시작일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
              onChange={this.handleParamChange('fromDate')}
              className={classes.fullWidth} />
            </Grid>
            <Grid item xs={3} >
            <TextField label="조회종료일" type="date" style={{width:150}}
              value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
              onChange={this.handleParamChange('toDate')}
              className={classes.fullWidth} />
            </Grid>
            <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
            </Grid>
            <Grid item xs={3} ></Grid>
          </Grid>

          <ResponsiveContainer width='100%' height={300} >
            <LineChart data={data} margin={{top: 35, right: 10, left: 10, bottom: 35}}>
              <XAxis dataKey="logDate" />
              <YAxis type="number" domain={[0, 'dataMax + 5']} />
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip />
              <Legend />

              <Line name="부팅보안침해" type="monotone" dataKey="bootProtectorCount" stroke="#82a6ca" />
              <Line name="실행보안침해" type="monotone" dataKey="exeProtectorCount" stroke="#ca82c2" />
              <Line name="OS보안침해" type="monotone" dataKey="osProtectorCount" stroke="#caa682" />
              <Line name="매체보안침해" type="monotone" dataKey="mediaProtectorCount" stroke="#bb4c4c" />

            </LineChart>
          </ResponsiveContainer>

          {/* data area */}
          {(listObj) &&
          <div style={{height:300,overflow:'auto'}}>
            <Table fixedHeader={true}>
              <GRCommonTableHead
                classes={classes}
                keyId="logDate"
                headFix={true}
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listAllData').map(n => {
                  return (
                    <TableRow hover key={n.get('logDate')} >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('logDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('bootProtectorCount') === '0') ? '.' : n.get('bootProtectorCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('exeProtectorCount') === '0') ? '.' : n.get('exeProtectorCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('osProtectorCount') === '0') ? '.' : n.get('osProtectorCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{(n.get('mediaProtectorCount') === '0') ? '.' : n.get('mediaProtectorCount')}</TableCell>
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
          </div>
        }
        {/* dialog(popup) component area */}
        <DailyProtectedSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          hasAction={true}
        />
        </GRPane>
        <DailyProtectedDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DailyProtectedProps: state.DailyProtectedModule
});

const mapDispatchToProps = (dispatch) => ({
  DailyProtectedActions: bindActionCreators(DailyProtectedActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyProtectedManage));



