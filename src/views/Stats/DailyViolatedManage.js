import React, { Component } from 'react';

import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DailyViolatedActions from 'modules/DailyViolatedModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import DailyViolatedSpec from './DailyViolatedSpec';
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
class DailyViolatedManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleSelectBtnClick = () => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    DailyViolatedActions.readDailyViolatedList(DailyViolatedProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = (name, value) => {
    this.props.DailyViolatedActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectData = (event, logDate, violatedType) => {
    const { DailyViolatedActions, DailyViolatedProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    
    DailyViolatedActions.readViolatedListPaged(DailyViolatedProps, compId, {
      logDate: formatDateToSimple(logDate, 'YYYY-MM-DD'),
      violatedType: violatedType,
      page: 0,
      keyword: ''
    });
  };

  handleParamChange = name => event => {
    this.props.DailyViolatedActions.changeListParamData({
      name: name, 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });

  };

  render() {
    const { classes } = this.props;
    const { DailyViolatedProps } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'logDate', isOrder: false, numeric: false, disablePadding: true, label: t("columnDate") },
      { id: 'boot', isOrder: false, numeric: false, disablePadding: true, label: t("columnBootViolated") },
      { id: 'exe', isOrder: false, numeric: false, disablePadding: true, label: t("columnExeViolated") },
      { id: 'os', isOrder: false, numeric: false, disablePadding: true, label: t("columnOSViolated") },
      { id: 'media', isOrder: false, numeric: false, disablePadding: true, label: t("columnMediaViolated") }
    ];

    const compId = this.props.match.params.grMenuId;
    const listObj = DailyViolatedProps.getIn(['viewItems', compId]);
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
                <Search />{t('buttonSearch')}
              </Button>
            </Grid>
            <Grid item lg={6} ></Grid>
          </Grid>

          <ResponsiveContainer width='100%' height={300} >
            <LineChart 
              data={data} 
              margin={{top: 35, right: 10, left: 10, bottom: 35}}
            >
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
                {listObj.get('listAllData').map(n => {
                  return (
                    <TableRow hover key={n.get('logDate')} >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('logDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell 
                        className={classes.grSmallAndClickAndCenterCell}
                        onClick={event => this.handleSelectData(event, n.get('logDate'), 'boot')}
                      >{(n.get('bootProtectorCount') === '0') ? '.' : n.get('bootProtectorCount')}</TableCell>
                      <TableCell 
                        className={classes.grSmallAndClickAndCenterCell}
                        onClick={event => this.handleSelectData(event, n.get('logDate'), 'exe')}
                      >{(n.get('exeProtectorCount') === '0') ? '.' : n.get('exeProtectorCount')}</TableCell>
                      <TableCell 
                        className={classes.grSmallAndClickAndCenterCell}
                        onClick={event => this.handleSelectData(event, n.get('logDate'), 'os')}
                      >{(n.get('osProtectorCount') === '0') ? '.' : n.get('osProtectorCount')}</TableCell>
                      <TableCell 
                        className={classes.grSmallAndClickAndCenterCell}
                        onClick={event => this.handleSelectData(event, n.get('logDate'), 'media')}
                      >{(n.get('mediaProtectorCount') === '0') ? '.' : n.get('mediaProtectorCount')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        }
        <div style={{marginTop:20}}>
        <DailyViolatedSpec compId={compId} />
        </div>
        </GRPane>
        <GRConfirm />
        
      </div>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DailyViolatedManage)));


