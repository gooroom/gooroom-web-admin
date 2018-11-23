import React, { Component } from 'react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyLoginCountActions from 'modules/DailyLoginCountModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import DailyLoginCountSpec from './DailyLoginCountSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DailyLoginCountManage extends Component {

  columnHeaders = [
    { id: 'logDate', isOrder: false, numeric: false, disablePadding: true, label: '날짜' },
    { id: 'loginAll', isOrder: false, numeric: false, disablePadding: true, label: '요청수' },
    { id: 'loginSuccess', isOrder: false, numeric: false, disablePadding: true, label: '접속성공' },
    { id: 'loginFail', isOrder: false, numeric: false, disablePadding: true, label: '접속실패' },
    { id: 'userAll', isOrder: false, numeric: false, disablePadding: true, label: '접속시도' },
    { id: 'userSuccess', isOrder: false, numeric: false, disablePadding: true, label: '접속성공' },
    { id: 'clientAll', isOrder: false, numeric: false, disablePadding: true, label: '접속시도' },
    { id: 'clientSuccess', isOrder: false, numeric: false, disablePadding: true, label: '접속성공' }
  ];

  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 0
    };
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyLoginCountActions, DailyLoginCountProps } = this.props;
    DailyLoginCountActions.readDailyLoginCountList(DailyLoginCountProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyLoginCountActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectData = (event, logDate, protectedType) => {
    const { DailyLoginCountActions, DailyLoginCountProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    DailyLoginCountActions.readLoginCountListPaged(DailyLoginCountProps, compId, {
      logDate: formatDateToSimple(logDate, 'YYYY-MM-DD'),
      page: 0,
      keyword: ''
    });
  };

  handleParamChange = name => event => {
    this.props.DailyLoginCountActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };

  handleChangeTabs = (event, value) => {
    this.setState({
        selectedTab: value
    });
  }


  render() {
    const { classes } = this.props;
    const { DailyLoginCountProps } = this.props;
    const { selectedTab } = this.state;
    const compId = this.props.match.params.grMenuId;
    
    const listObj = DailyLoginCountProps.getIn(['viewItems', compId]);
    let data = [];
    if(listObj && listObj.get('listAllData')) {
      data = listObj.get('listAllData').toJS().map((e) => {
        e.logDate = formatDateToSimple(e.logDate, 'MM/DD');
        return e;
      });
    }

    return (
      <div>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={4} sm={4} lg={2} >
              <TextField label="조회시작일" type="date" style={{width:150}}
                value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
                onChange={this.handleParamChange('fromDate')}
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} sm={4} lg={2}>
              <TextField label="조회종료일" type="date" style={{width:150}}
                value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
                onChange={this.handleParamChange('toDate')}
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} sm={4} lg={2} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                <Search />조회
              </Button>
            </Grid>
            <Grid item lg={6} ></Grid>
          </Grid>

          <AppBar elevation={0} position="static" color="default">
            <Tabs value={selectedTab} 
                scrollable    
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleChangeTabs}
            >
              <Tab label="접속요청 수" value={0} />
              <Tab label="접속요청 사용자수" value={1} />
              <Tab label="접속요청 단말수" value={2} />
            </Tabs>
          </AppBar>
          <Paper elevation={0} style={{ maxHeight: 460, overflow: 'auto' }} >
          {selectedTab === 0 && 
            <ResponsiveContainer width='100%' height={300} >
              <LineChart data={data} margin={{top: 35, right: 10, left: 10, bottom: 35}}>
                <XAxis dataKey="logDate" />
                <YAxis type="number" domain={[0, 'dataMax + 5']} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Line name="접속요청수" type="monotone" dataKey="loginAll" stroke="#82a6ca" />
                <Line name="접속성공" type="monotone" dataKey="loginSuccess" stroke="#ca82c2" />
                <Line name="접속실패" type="monotone" dataKey="loginFail" stroke="#caa682" />
              </LineChart>
            </ResponsiveContainer>
          }
          {selectedTab === 1 && 
            <ResponsiveContainer width='100%' height={300} >
              <LineChart data={data} margin={{top: 35, right: 10, left: 10, bottom: 35}}>
                <XAxis dataKey="logDate" />
                <YAxis type="number" domain={[0, 'dataMax + 5']} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Line name="접속요청수" type="monotone" dataKey="userAll" stroke="#82a6ca" />
                <Line name="접속성공" type="monotone" dataKey="userSuccess" stroke="#ca82c2" />
              </LineChart>
            </ResponsiveContainer>
          }
          {selectedTab === 2 && 
            <ResponsiveContainer width='100%' height={300} >
              <LineChart data={data} margin={{top: 35, right: 10, left: 10, bottom: 35}}>
                <XAxis dataKey="logDate" />
                <YAxis type="number" domain={[0, 'dataMax + 5']} />
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip />
                <Legend />
                <Line name="접속요청수" type="monotone" dataKey="clientAll" stroke="#82a6ca" />
                <Line name="접속성공" type="monotone" dataKey="clientSuccess" stroke="#ca82c2" />
              </LineChart>
            </ResponsiveContainer>
          }
          </Paper>

          {/* data area */}
          {(listObj) &&
          <div style={{height:300,overflow:'auto'}}>
            <Table>
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
                    <TableRow hover key={n.get('logDate')} 
                    onClick={event => this.handleSelectData(event, n.get('logDate'), 'boot')}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('logDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('loginAll')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('loginSuccess')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('loginFail')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('userAll')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('userSuccess')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientAll')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientSuccess')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        }
        <div style={{marginTop:20}}>
        <DailyLoginCountSpec compId={compId} />
        </div>
        </GRPane>
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DailyLoginCountProps: state.DailyLoginCountModule
});

const mapDispatchToProps = (dispatch) => ({
  DailyLoginCountActions: bindActionCreators(DailyLoginCountActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyLoginCountManage));



