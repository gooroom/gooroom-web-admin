import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { formatBytes } from 'components/GRUtils/GRCommonUtils';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';
import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

import Search from '@material-ui/icons/Search'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageComp extends Component {

  columnHeaders = [
    { id: 'STATUS_CD', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'LOGIN_ID', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    { id: 'GROUP_NAME', isOrder: true, numeric: false, disablePadding: true, label: '단말그룹' },
    { id: 'LAST_LOGIN_TIME', isOrder: true, numeric: false, disablePadding: true, label: '최종접속일' },
    { id: 'CLIENT_IP', isOrder: true, numeric: false, disablePadding: true, label: '최종접속IP' },
    { id: 'STRG_SIZE', isOrder: false, numeric: false, disablePadding: true, label: '용량' },
    { id: 'TOTAL_CNT', isOrder: true, numeric: false, disablePadding: true, label: '패키지수' }
  ];

  componentDidMount() {
    if(this.props.selectorType && this.props.selectorType == 'multiple') {
      this.columnHeaders.unshift({ id: "chCheckbox", isCheckbox: true });
    }
    this.props.ClientManageActions.readClientListPaged(this.props.ClientManageProps, this.props.compId, {}, {isResetSelect:false, isInitParam:true});
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      rowsPerPage: event.target.value, page:0
    });
  };

  // .................................................
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleClickAllCheck = (event, checked) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientManageProps, compId, 'clientId', checked);

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(ClientManageProps, compId, id);  

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

  }

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const selectRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');
    // let newCheckedIds = '';
    // if(this.props.selectorType && this.props.selectorType == 'multiple') {
    //   newCheckedIds = setCheckedIdsInComp(ClientManageProps, compId, id);  
    //   ClientManageActions.changeCompVariable({
    //     name: 'checkedIds',
    //     value: newCheckedIds,
    //     compId: compId
    //   });
    // } else {
    //   newCheckedIds = id;
    // }

    if(this.props.onSelect) {
      this.props.onSelect(selectRowObject);
    }
    
    // rest actions..
    
  };

  isChecked = id => {
    const { ClientManageProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientManageProps, compId, 'checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { ClientManageProps, compId } = this.props;
    const selectId = getDataObjectVariableInComp(ClientManageProps, compId, 'selectId');
    return (selectId == id);
  }

  // .................................................
  handleChangeClientStatusSelect = (event, property) => {
    const { ClientManageProps, ClientManageActions, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      clientType: property, page:0
    });

  };

  handleKeywordChange =(name, value) => {
    this.props.ClientManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {page: 0});
  };

  render() {
    const { classes } = this.props;
    const { ClientManageProps, compId } = this.props;

    const listObj = ClientManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="client-status">단말상태</InputLabel>
              <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
            </FormControl>
          </Grid>
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={4} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
          </Grid>
        </Grid>

        {/* data area */}
        {listObj &&
        <Table>
          {(this.props.selectorType && this.props.selectorType == 'multiple') && 
          <GRCommonTableHead
            classes={classes}
            keyId="clientId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onClickAllCheck={this.handleClickAllCheck}
            checkedIds={listObj.get('checkedIds')}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          }
          {(!this.props.selectorType || this.props.selectorType == 'single') && 
          <GRCommonTableHead
            classes={classes}
            keyId="clientId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={this.columnHeaders}
          />
          }
          <TableBody>
            {listObj.get('listData') && listObj.get('listData').map(n => {
              const isChecked = this.isChecked(n.get('clientId'));
              const isSelected = this.isSelected(n.get('clientId'));

              let storageRate = '';
              let storageInfo = '';
              if(n.get('strgSize') && n.get('strgSize') > 0 && n.get('strgUse') && n.get('strgUse') > 0) {
                storageRate = ((n.get('strgUse') * 100) / n.get('strgSize')).toFixed(2) + '%';
                storageInfo = formatBytes(n.get('strgUse'), 1) + '/' + formatBytes(n.get('strgSize'), 1);
              }

              return (
                <TableRow
                  hover
                  className={(isSelected) ? classes.grSelectedRow : ''}
                  onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                  role="checkbox"
                  key={n.get('clientId')}
                >
                {(this.props.selectorType && this.props.selectorType == 'multiple') && 
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('clientId'))}/>
                  </TableCell>
                }
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('viewStatus')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('loginId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientGroupName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('lastLoginTime'), 'YY/MM/DD HH:mm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientIp')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >
                  <Tooltip title={storageInfo}>
                    <Typography>{storageRate}</Typography>
                  </Tooltip>
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{n.get('totalCnt')}</TableCell>
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

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientManageComp));

