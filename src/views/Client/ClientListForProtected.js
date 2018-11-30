import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import ClientStatusSelect from "views/Options/ClientStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import ProtectedIcon from '@material-ui/icons/Error';
import ServiceStoppedIcon from '@material-ui/icons/PauseCircleOutline';
import ServiceRunningIcon from '@material-ui/icons/PlayCircleFilled';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientListForProtected extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
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

  columnHeaders = [
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },

    { id: 'IS_BOOTPROTECTOR', isOrder: true, numeric: false,disablePadding: true,label: '부팅보안침해'},
    { id: 'IS_EXEPROTECTOR', isOrder: true, numeric: false,disablePadding: true,label: '실행보안침해'},
    { id: 'IS_OSPROTECTOR', isOrder: true, numeric: false,disablePadding: true,label: 'OS보안침해'},
    { id: 'IS_MEDIAPROTECTOR', isOrder: true, numeric: false,disablePadding: true,label: '매체보안침해'},

    { id: 'IS_BOOTPROTECTOR_STOP', isOrder: true, numeric: false,disablePadding: true,label: '부팅보안기능작동'},
    { id: 'IS_EXEPROTECTOR_STOP', isOrder: true, numeric: false,disablePadding: true,label: '실행보안기능작동'},
    { id: 'IS_OSPROTECTOR_STOP', isOrder: true, numeric: false,disablePadding: true,label: 'OS보안기능작동'},
    { id: 'IS_MEDIAPROTECTOR_STOP', isOrder: true, numeric: false,disablePadding: true,label: '매체보안기능작동'},
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '조치' }
  ];

  handleGetClientList = (newListParam) => {
    requestPostAPI('readProtectedClientList', {
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

  // componentWillReceiveProps(newProps) {
  //   const { stateData } = this.state;
  //   const newListParam = (stateData.get('listParam')).merge({
  //     deptCd: newProps.deptCd
  //   });
  //   this.handleGetClientList(newListParam);
  // }

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

  handleChangeSort = (columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetClientList(newListParam);
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
    //this.handleGetClientList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetClientList(newListParam);
  };

  handleClickRepairClient = (clientId) => {

    if(clientId && clientId != '') {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: '단말 침해 조치',
        confirmMsg: '침해가 발생한 단말(' + clientId + ')을 조치 하시겠습니까?',
        handleConfirmResult: ((confirmValue, confirmObject) => {
          if(confirmValue) {
            requestPostAPI('createResetProtectedClient', confirmObject).then(
              (response) => {
                if(response && response.data && response.data.status && response.data.status.result == 'success') {
                  this.props.GRAlertActions.showAlert({
                    alertTitle: '조치작업',
                    alertMsg: '침해단말 조치작업이 실행 되었습니다.'
                  });
                } else {
                  this.props.GRAlertActions.showAlert({
                    alertTitle: '시스템오류',
                    alertMsg: '침해단말 조치작업이 수행되지 못하였습니다.'
                  });
                }
              }
            ).catch(error => {
            });
          }}),
        confirmObject: {clientId: clientId}
      });
    }
  }

  handleClickItem = (type, clientId) => {
    this.props.onClickItem(type, clientId);
  }

  render() {
    const { classes } = this.props;
    
    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <KeywordOption handleKeywordChange={this.handleKeywordChange} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search />조회
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2}
                sortDirection={listObj.getIn(['listParam', 'orderColumn']) === 'CLIENT_ID' ? listObj.getIn(['listParam', 'orderDir']) : false}
              >단말아이디
              </TableCell>

              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2}
                sortDirection={listObj.getIn(['listParam', 'orderColumn']) === 'CLIENT_NM' ? listObj.getIn(['listParam', 'orderDir']) : false}
              >단말이름
              </TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} colSpan={4}>침해상태</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} colSpan={4}>보안점검기능 작동여부</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2} >조치</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className={classes.grSmallAndHeaderCell} >부팅보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >실행보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >OS보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >매체보안</TableCell>

              <TableCell className={classes.grSmallAndHeaderCell} >부팅보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >실행보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >OS보안</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >매체보안</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listObj.get('listData').map(n => {
              const protectIcon = (n.get('isBootProtector') == 1) ? <ProtectedIcon /> : '';
              const serviceIcon = (n.get('isBootProtector') == 1) ? <ProtectedIcon /> : '';
              
              return (
                <TableRow hover key={n.get('clientId')} >
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>

                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isBootProtector') == 1) ? <ProtectedIcon color="primary" /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isExeProtector') == 1) ? <ProtectedIcon color="primary" /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isOsProtector') == 1) ? <ProtectedIcon color="primary" /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isMediaProtector') == 1) ? <ProtectedIcon color="primary" onClick={() => this.handleClickItem('MEDIA', n.get('clientId'))} /> : ''}</TableCell>

                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopBootProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopExeProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopOsProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopMediaProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>
                    <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleClickRepairClient(n.get('clientId'))}>
                      <SettingsApplicationsIcon />
                    </Button>
                  </TableCell>
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
      <GRAlert />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientListForProtected));

