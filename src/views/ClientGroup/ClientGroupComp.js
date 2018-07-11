import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupCompActions from '../../modules/ClientGroupCompModule';
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
class ClientGroupCompHead extends Component {

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

    let checkSelection = 0;
    if(listData && listData.length > 0) {
      checkSelection = arrayContainsArray(selectedData, listData.map(x => x.grpId));
    }
    
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
          {ClientGroupCompHead.columnData.map(column => {
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
class ClientGroupComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {

    const { ClientGroupCompActions, ClientGroupCompProps } = this.props;
    //ClientGroupCompActions.setInitialize();
    ClientGroupCompActions.readClientGroupList(getMergedListParam(ClientGroupCompProps.listParam, {
      page:0,
      compId: this.props.compId
    }));

    //this.loadInitData({page:0});
  }

  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientGroupCompActions, ClientGroupCompProps, compId } = this.props;
    const { [compId + '__listData'] : compListData, [compId + '__listParam'] : compListParam } = ClientGroupCompProps;

    let orderDir = "desc";
    if (compListParam.orderColumn === property && compListParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupCompActions.readClientGroupList(getMergedListParam(compListParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: this.props.compId
    }));
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientGroupCompActions, ClientGroupCompProps, compId } = this.props;
    const { [compId + '__listData'] : compListData, [compId + '__listParam'] : compListParam } = ClientGroupCompProps;

    if(checked) {
      const newSelected = compListData.map(n => n.grpId)
      ClientGroupCompActions.changeStoreData({
        name: compId + '__selected',
        value: newSelected
      });
      this.props.onChangeGroupSelected(compId, newSelected);
    } else {
      ClientGroupCompActions.changeStoreData({
        name: compId + '__selected',
        value: []
      });
      this.props.onChangeGroupSelected(compId, []);
    }
  };

  handleRowClick = (event, id) => {
    const { ClientGroupCompProps, ClientGroupCompActions, compId } = this.props;
    const { [compId + '__selected'] : preSelected } = ClientGroupCompProps;
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

    ClientGroupCompActions.changeStoreData({
      name: compId + '__selected',
      value: newSelected
    });

    const selectedItem = ClientGroupCompProps[compId + '__listData'].find(function(element) {
      return element.grpId == id;
    });

    if(this.props.onChangeGroupSelected) {
      this.props.onChangeGroupSelected(compId, newSelected, selectedItem);
    }    
  };

  handleChangePage = (event, page) => {
    const { ClientGroupCompActions, ClientGroupCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientGroupCompProps;

    ClientGroupCompActions.readClientGroupList(getMergedListParam(compListParam, {
      page: page, 
      compId: this.props.compId
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupCompActions, ClientGroupCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientGroupCompProps;

    ClientGroupCompActions.readClientGroupList(getMergedListParam(compListParam, {
      rowsPerPage: event.target.value,
      page:0,
      compId: this.props.compId
    }));
  };

  //isSelected = id => this.state.selected.indexOf(id) !== -1;
  isSelected = id => {
    const { ClientGroupCompProps, compId } = this.props;
    const { [compId + '__selected'] : compSelected } = ClientGroupCompProps;
    return compSelected.indexOf(id) !== -1;
  }

  // loadInitData = (param) => {
  //   const { ClientGroupCompActions, ClientGroupCompProps } = this.props;
  //   ClientGroupCompActions.readClientGroupList(getMergedListParam(ClientGroupCompProps.listParam, param));
  // };

  // .................................................

  render() {

    const { ClientGroupCompProps, compId } = this.props;
    const emptyRows = 0;// = ClientGroupCompProps.listParam.rowsPerPage - ClientGroupCompProps.listData.length;

    const { [compId + '__listData'] : compListData, [compId + '__listParam'] : compListParam, [compId + '__selected'] : compSelected } = ClientGroupCompProps;

    return (

      <div className={tableContainerClass}>
        <Table className={tableClass}>
          <ClientGroupCompHead
            onSelectAllClick={this.handleSelectAllClick}
            orderDir={compListParam && compListParam.orderDir}
            orderColumn={compListParam && compListParam.orderColumn}
            onRequestSort={this.handleRequestSort}
            selectedData={compSelected}
            listData={compListData}
          />
          <TableBody>
          {compListData && compListData.map(n => {
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
                colSpan={ClientGroupCompHead.columnData.length + 1}
                className={tableCellClass}
              />
            </TableRow>
          )}
          </TableBody>
        </Table>
        {compListParam &&
          <TablePagination
            component='div'
            count={compListParam && compListParam.rowsFiltered}
            rowsPerPage={compListParam && compListParam.rowsPerPage}
            rowsPerPageOptions={[]}
            labelDisplayedRows={() => {return ''}}
            page={compListParam && compListParam.page}
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
  ClientGroupCompProps: state.ClientGroupCompModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupCompActions: bindActionCreators(ClientGroupCompActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupComp);


