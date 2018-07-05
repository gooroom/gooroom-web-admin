import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { css } from 'glamor';

import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

//
//  ## Theme override ########## ########## ########## ########## ########## 
//

//
//  ## Style ########## ########## ########## ########## ########## 
//
const tableClass = css({
  minWidth: "100% !important"
}).toString();

const tableHeadCellClass = css({
  whiteSpace: "nowrap",
  padding: "0px !important"
}).toString();

const tableContainerClass = css({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    height: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const tableRowClass = css({
  height: "2em !important"
}).toString();

const tableCellClass = css({
  height: "1em !important",
  padding: "0px !important",
  cursor: "pointer"
}).toString();


//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientGroupManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
  ];

  render() {
    const { 
      onSelectAllClick,
      orderDir,
      orderColumn,
      selectedData,
      listData
    } = this.props;

    const checkSelection = arrayContainsArray(selectedData, listData.map(x => x.grpId));
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={tableHeadCellClass} >
            <Checkbox
              indeterminate={checkSelection === 50}
              checked={checkSelection === 100}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {ClientGroupManageHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
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
class ClientGroupManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {

    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.setInitialize();
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {page:0}));

    //this.loadInitData({page:0});
  }

  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    let orderDir = "desc";
    if (ClientGroupProps.listParam.orderColumn === property && ClientGroupProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    if(checked) {
      const newSelected = ClientGroupProps.listData.map(n => n.grpId)
      ClientGroupActions.changeStoreData({
        name: 'selected',
        value: newSelected
      });
      this.props.onChangeGroupSelected(newSelected);
    } else {
      ClientGroupActions.changeStoreData({
        name: 'selected',
        value: []
      });
      this.props.onChangeGroupSelected([]);
    }
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const { selected : preSelected } = ClientGroupProps;
    const selectedIndex = preSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(preSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(preSelected.slice(1));
    } else if (selectedIndex === preSelected.length - 1) {
      newSelected = newSelected.concat(preSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        preSelected.slice(0, selectedIndex),
        preSelected.slice(selectedIndex + 1)
      );
    }

    ClientGroupActions.changeStoreData({
      name: 'selected',
      value: newSelected
    });

    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });

    this.props.onChangeGroupSelected(newSelected, selectedItem);
  };

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {page: page}));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {rowsPerPage: event.target.value}));
  };

  //isSelected = id => this.state.selected.indexOf(id) !== -1;
  isSelected = id => {
    const { ClientGroupProps } = this.props;
    return ClientGroupProps.selected.indexOf(id) !== -1;
  }

  loadInitData = (param) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, param));
  };

  // .................................................

  render() {

    const { ClientGroupProps } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    return (

      <div className={tableContainerClass}>
        <Table className={tableClass}>
          <ClientGroupManageHead
            onSelectAllClick={this.handleSelectAllClick}
            orderDir={ClientGroupProps.listParam.orderDir}
            orderColumn={ClientGroupProps.listParam.orderColumn}
            onRequestSort={this.handleRequestSort}
            selectedData={ClientGroupProps.selected}
            listData={ClientGroupProps.listData}
          />
          <TableBody>
          {ClientGroupProps.listData.map(n => {
            const isSelected = this.isSelected(n.grpId);
            return (
              <TableRow
                className={tableRowClass}
                hover
                onClick={event => this.handleRowClick(event, n.grpId)}
                role="checkbox"
                aria-checked={isSelected}
                key={n.grpId}
                selected={isSelected}
              >
                <TableCell
                  padding="checkbox"
                  className={tableCellClass}
                >
                  <Checkbox
                    checked={isSelected}
                    className={tableCellClass}
                  />
                </TableCell>
                <TableCell className={tableCellClass}>
                  {n.grpNm}
                </TableCell>
                <TableCell className={tableCellClass}>
                  {n.clientCount}
                </TableCell>
              </TableRow>
            );
          })}

          {emptyRows > 0 && (
            <TableRow style={{ height: 32 * emptyRows }}>
              <TableCell
                colSpan={ClientGroupManageHead.columnData.length + 1}
                className={tableCellClass}
              />
            </TableRow>
          )}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          count={ClientGroupProps.listParam.rowsFiltered}
          rowsPerPage={ClientGroupProps.listParam.rowsPerPage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => {return ''}}
          page={ClientGroupProps.listParam.page}
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
  ClientGroupProps: state.ClientGroupModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupManage);


