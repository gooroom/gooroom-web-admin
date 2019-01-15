import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { formatBytes, getClientStatusIcon } from 'components/GRUtils/GRCommonUtils';

import ClientStatusSelect from "views/Options/ClientStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import RefreshIcon from '@material-ui/icons/Refresh';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";


class ClientListForDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          clientType: 'ONLINE',
          groupId: '',
          keyword: '',
          orderDir: 'asc',
          orderColumn: 'CLIENT_NM',
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

  handleGetClientList = (newListParam) => {

    requestPostAPI('readClientListPaged', {
      clientType: 'ONLINE',
      keyword: newListParam.get('keyword'),
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
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetClientList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetClientList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetClientList(newListParam);
  };
  // .................................................

  handleClickRefresh = () => {
    this.handleSelectBtnClick();
  }

  handleSelectRow = (event, id) => {

    // const { stateData } = this.state;
    // const checkedIds = stateData.get('checkedIds');
    // let newCheckedIds = null;
    // if(checkedIds) {
    //     const indexNo = checkedIds.indexOf(id);
    //     if(indexNo > -1) {
    //       newCheckedIds = checkedIds.delete(indexNo);
    //     } else {
    //       newCheckedIds = checkedIds.push(id);
    //     }
    // } else {
    //   newCheckedIds = List([id]);
    // }
    // this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    // this.props.onSelectClient(newCheckedIds);
  };

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      page: 0
    });
    this.handleGetClientList(newListParam);
  };

  handleClickViolatedItem = (type, clientId) => {
    this.props.onClickViolatedItem(type, clientId);
  }

  handleClickShowUserInfo = (userId, clientId) => {
    this.props.onClickShowUserInfo((userId.startsWith('+')) ? '' : userId, clientId);
  }

  handleClickPackageInfo = (type, clientId) => {
    this.props.onClickShowPackageInfo(type, clientId);
  }
  
  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'STATUS_CD', isOrder: true, numeric: false, disablePadding: true, label: t("colStatus") },
      { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: t("colClientId") },
      { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: t("colClientName") },
      { id: 'GROUP_NAME', isOrder: true, numeric: false,disablePadding: true,label: t("colClientGroup") },
      { id: 'temp1', isOrder: false, numeric: false,disablePadding: true,label: t("colLoginId") },
      { id: 'temp2', isOrder: false, numeric: false,disablePadding: true,label: t("colLastLoginDate") },
      { id: 'CNT_VIOLATED', isOrder: true, numeric: false, disablePadding: true, label: t("colViolatedCnt") },
      { id: 'CLIENT_IP', isOrder: true, numeric: false, disablePadding: true, label: t("colLastLoginIp") },
      { id: 'STRG_SIZE', isOrder: false, numeric: false, disablePadding: true, label: t("colUseRate"), tooltip: t("spHomeSizeRate") },
      { id: 'temp3', isOrder: false, numeric: false,disablePadding: true,label: t("colPackageUpdateCnt") }
    ];

    const listObj = this.state.stateData;
    
    return (
      <div style={{paddingTop:10}}>
      <Grid container spacing={0} >
        <Grid item>
        <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
          Online Client List
        </Typography>
        </Grid>
        <Grid item>
        <Button className={classes.GRIconSmallButton} style={{minWidth:25,marginRight:10}}
          variant="contained" color={"primary"} 
          onClick={this.handleClickRefresh} ><RefreshIcon /></Button>
        </Grid>
      </Grid>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="userId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {

              let storageRate = '';
              let storageInfo = '';
              if(n.get('strgSize') && n.get('strgSize') > 0 && n.get('strgUse') && n.get('strgUse') > 0) {
                storageRate = ((n.get('strgUse') * 100) / n.get('strgSize')).toFixed(2) + '%';
                storageInfo = formatBytes(n.get('strgUse'), 1) + '/' + formatBytes(n.get('strgSize'), 1);
              }

              return (
                <TableRow
                  hover
                  onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                  role="checkbox"
                  key={n.get('clientId')}
                >
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{getClientStatusIcon(n.get('viewStatus'))}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientGroupName')}</TableCell>
                  {(n.get('loginId') !== '-') && 
                    <TableCell className={classes.grSmallAndClickAndCenterCell} 
                      style={{fontWeight:'bold',textDecoration:'underline'}}
                      onClick={() => this.handleClickShowUserInfo(n.get('loginId'), n.get('clientId'))}>
                      {(n.get('loginId').startsWith('+')) ? n.get('loginId').substring(1) + " [LU]" : n.get('loginId')}
                    </TableCell>
                  }
                  {(n.get('loginId') === '-' || n.get('loginId') === '') && 
                    <TableCell className={classes.grSmallAndClickAndCenterCell} >
                    {n.get('loginId')}
                    </TableCell>
                  }
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{formatDateToSimple(n.get('lastLoginTime'), 'YY-MM-DD HH:mm')}</TableCell>
                  {(n.get('isProtector') == '1') && 
                  <TableCell className={classes.grSmallAndClickAndCenterCell} 
                    style={{color:'red',fontWeight:'bold',textDecoration:'underline'}}
                    onClick={() => this.handleClickViolatedItem('ALL', n.get('clientId'))}>
                    {Number(n.get('countBootProtector')) + Number(n.get('countExeProtector')) + Number(n.get('countOsProtector')) + Number(n.get('countMediaProtector'))}
                  </TableCell>
                  }
                  {(n.get('isProtector') == '0') && 
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >0</TableCell>
                  }
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{n.get('clientIp')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndRightCell} >
                    <Tooltip title={storageInfo}>
                      <Typography>{storageRate}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{n.get('updateTargetCnt')}</TableCell>
                  {(n.get('updateTargetCnt') < -999) && 
                  <TableCell className={classes.grSmallAndClickAndCenterCell} 
                    style={{color:'red',fontWeight:'bold',textDecoration:'underline'}}
                    onClick={() => this.handleClickPackageInfo('ALL', n.get('clientId'))}>
                    {n.get('updateTargetCnt')}
                  </TableCell>
                  }
                  {(n.get('updateTargetCnt') < -999) && 
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >0</TableCell>
                  }
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

export default translate("translations")(withStyles(GRCommonStyle)(ClientListForDashboard));

