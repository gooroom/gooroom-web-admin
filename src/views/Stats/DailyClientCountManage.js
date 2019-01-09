import React, { Component } from 'react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyClientCountActions from 'modules/DailyClientCountModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import DailyClientCountSpec from './DailyClientCountSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DailyClientCountManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    DailyClientCountActions.readDailyClientCountList(DailyClientCountProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyClientCountActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectData = (event, logDate, searchType) => {
    const { DailyClientCountActions, DailyClientCountProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    DailyClientCountActions.readClientCountListPaged(DailyClientCountProps, compId, {
      logDate: formatDateToSimple(logDate, 'YYYY-MM-DD'),
      searchType: searchType,
      page: 0,
      keyword: ''
    });
  };

  handleParamChange = name => event => {
    this.props.DailyClientCountActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };

  render() {
    const { classes } = this.props;
    const { DailyClientCountProps } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'logDate', isOrder: false, numeric: false, disablePadding: true, label: t("colDate") },
      { id: 'regCount', isOrder: false, numeric: false, disablePadding: true, label: t("colRegCount") },
      { id: 'revokeCount', isOrder: false, numeric: false, disablePadding: true, label: t("colRevokeCount") }
    ];

    const compId = this.props.match.params.grMenuId;

    const listObj = DailyClientCountProps.getIn(['viewItems', compId]);
    let data = [];
    if(listObj && listObj.get('listAllData')) {
      data = listObj.get('listAllData').toJS().map((e) => {
        e.logDate = formatDateToSimple(e.logDate, 'MM/DD');
        return e;
      });
    }

    return (
      <div>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={4} sm={4} lg={2} >
              <TextField label={t('searchStartDate')} type="date" style={{width:150}}
                value={(listObj && listObj.getIn(['listParam', 'fromDate'])) ? listObj.getIn(['listParam', 'fromDate']) : '1999-01-01'}
                onChange={this.handleParamChange('fromDate')}
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} sm={4} lg={2}>
              <TextField label={t('searchEndDate')} type="date" style={{width:150}}
                value={(listObj && listObj.getIn(['listParam', 'toDate'])) ? listObj.getIn(['listParam', 'toDate']) : '1999-01-01'}
                onChange={this.handleParamChange('toDate')}
                className={classes.fullWidth} />
            </Grid>
            <Grid item xs={4} sm={4} lg={2} >
              <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                <Search />{t("btnSearch")}
              </Button>
            </Grid>
            <Grid item lg={6} ></Grid>
          </Grid>

          <ResponsiveContainer width='100%' height={300} >
            <LineChart data={data} margin={{top: 35, right: 10, left: 10, bottom: 35}}>
              <XAxis dataKey="logDate" />
              <YAxis type="number" domain={[0, 'dataMax + 5']} />
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip />
              <Legend />
              <Line name={t('regClientCount')} type="monotone" dataKey="regCount" stroke="#62b6e2" />
              <Line name={t('revokeClientCount')} type="monotone" dataKey="revokeCount" stroke="#efa7a7" />
            </LineChart>
          </ResponsiveContainer>

          {/* data area */}
          {(listObj) &&
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={12} sm={4} lg={2} style={{border: '1px solid #efefef'}}>
              <div style={{height:340,overflow:'auto'}}>
                <Table>
                  <GRCommonTableHead classes={classes} keyId="logDate"
                    headFix={true} columnData={columnHeaders} />
                  <TableBody>
                    {listObj.get('listAllData').map(n => {
                      return (
                        <TableRow hover key={n.get('logDate')} style={{height:16}}>
                          <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('logDate'), 'YYYY-MM-DD')}</TableCell>
                          <TableCell 
                            className={classes.grSmallAndClickAndCenterCell}
                            onClick={event => this.handleSelectData(event, n.get('logDate'), 'create')}
                          >{(n.get('regCount') === '0') ? '.' : n.get('regCount')}</TableCell>
                          <TableCell 
                            className={classes.grSmallAndClickAndCenterCell}
                            onClick={event => this.handleSelectData(event, n.get('logDate'), 'revoke')}
                          >{(n.get('revokeCount') === '0') ? '.' : n.get('revokeCount')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Grid>
            <Grid item xs={12} sm={8} lg={10} style={{border: '1px solid #efefef'}}>
            <DailyClientCountSpec compId={compId} />
            </Grid>
          </Grid>

        }
        </GRPane>
        <GRConfirm />
        
      </div>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyClientCountManage)));



