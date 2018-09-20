import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageCompActions from 'modules/ClientManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import { getDataObjectInComp, getRowObjectById, getDataObjectVariableInComp } from 'components/GrUtils/GrTableListUtils';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'loginId', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    {
      id: 'clientGroupName', isOrder: true, 
      numeric: false,
      disablePadding: true,
      label: '단말그룹'
    },
    { id: 'regDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' }
  ];

  render() {
    const { classes } = this.props;
    const {
      onSelectAllClick,
      orderDir,
      orderColumn,
      selectedData,
      listData
    } = this.props;

    let checkSelection = 0;
    if(listData && listData.length > 0) {
      checkSelection = arrayContainsArray(selectedData, listData.map(x => x.clientId));
    }

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={classes.grSmallAndHeaderCell} >
            <Checkbox
              indeterminate={checkSelection === 50}
              checked={checkSelection === 100}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {ClientManageHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
                key={column.id}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel active={orderColumn === column.id}
                            direction={orderDir}
                            onClick={this.createSortHandler(column.id)}
                         >{column.label}</TableSortLabel>
                } else {
                  return <p>{column.label}</p>
                }
              })()}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManage extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'loginId', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    { id: 'clientGroupName', isOrder: true, numeric: false, disablePadding: true, label: '단말그룹' },
    { id: 'regDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' }
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    ClientManageCompActions.readClientList(ClientManageProps, compId);
  }

  handleChangePage = (event, page) => {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    ClientManageCompActions.readClientList(ClientManageProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    ClientManageCompActions.readClientList(ClientManageProps, compId, {
      rowsPerPage: event.target.value, 
      page:0
    });
  };

  // .................................................
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    ClientManageCompActions.readClientList(ClientManageProps, compId, {
      orderColumn: columnId,
      orderDir: orderDir
    });
  };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    const listObj = getDataObjectInComp(ClientManageProps, compId);
    let newSelectedIds = listObj.get('selectedIds');
    if(newSelectedIds) {
      if(checked) {
        // select all
        listObj.get('listData').map((element) => {
          if(!newSelectedIds.includes(element.get('clientId'))) {
            newSelectedIds = newSelectedIds.push(element.get('clientId'));
          }
        });
      } else {
        // deselect all
        listObj.get('listData').map((element) => {
          const index = newSelectedIds.findIndex((e) => {
            return e == element.get('clientId');
          });
          if(index > -1) {
            newSelectedIds = newSelectedIds.delete(index);
          }
        });
      }
    } else {
      if(checked) {
        newSelectedIds = listObj.get('listData').map((element) => {return element.get('clientId');});
      }
    }

    ClientManageCompActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageCompActions, ClientManageProps, compId } = this.props;
    const clickedRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');

    let selectedIds = getDataObjectVariableInComp(ClientManageProps, compId, 'selectedIds');
    if(selectedIds === undefined) {
      selectedIds = List([]);
    }

    // delete if exist or add if no exist.
    const index = selectedIds.findIndex(e => e === id);
    let newSelectedIds = null;
    if(index < 0) {
      // add (push)
      newSelectedIds = selectedIds.push(id);
    } else {
      // delete
      newSelectedIds = selectedIds.delete(index);
    }
    ClientManageCompActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject, newSelectedIds);
    }
    
    // rest actions..
    
  };

  isSelected = id => {
    const { ClientManageProps, compId } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientManageProps, compId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }

  // handleKeywordChange = name => event => {
  //   const { ClientManageCompActions, ClientManageProps, compId } = this.props;
  //   const { [compId + '__listParam'] : compListParam } = ClientManageProps;

  //   const newParam = getMergedObject(compListParam, {
  //     keyword: event.target.value,
  //     page:0,
  //     compId: this.props.compId
  //   });
  //   ClientManageCompActions.changeStoreData({
  //     name: compId + '__listParam',
  //     value: newParam
  //   });
  // };

  render() {
    const { classes } = this.props;
    const { ClientManageProps, compId } = this.props;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;
    const listObj = getDataObjectInComp(ClientManageProps, compId);

    return (

      <div>
        <Table>
          <GrCommonTableHead
            classes={classes}
            keyId="clientId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onSelectAllClick={this.handleSelectAllClick}
            selectedIds={listObj.get('selectedIds')}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {
                const isSelected = this.isSelected(n.get('clientId'));
                return (
                  <TableRow
                    className={classes.grNormalTableRow}
                    hover
                    onClick={event => this.handleRowClick(event, n.get('clientId'))}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.get('clientId')}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                      <Checkbox checked={isSelected} className={classes.grObjInCell} />
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.get('clientStatus')}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.get('clientName')}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.get('loginId')}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.get('clientGroupName')}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}
                    </TableCell>
                  </TableRow>
                );
              })}

            {emptyRows > 0 && (
              <TableRow >
                <TableCell
                  colSpan={ClientManageHead.columnData.length + 1}
                  className={classes.grSmallAndClickCell}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageCompActions: bindActionCreators(ClientManageCompActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManage));

