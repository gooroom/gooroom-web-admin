import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageCompActions from 'modules/ClientManageCompModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

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
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    ClientManageCompActions.readClientList(getMergedObject((compListParam) ? compListParam : ClientManageCompProps.listParam, {
      page:0,
      compId: compId
    }));
  }

  // .................................................
  handleRequestSort = (event, property) => {

    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    let orderDir = "desc";
    if (compListParam.orderColumn === property && compListParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientManageCompActions.readClientList(getMergedObject(compListParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: compId
    }));
  };

  isSelected = id => {
    const { ClientManageCompProps, compId } = this.props;
    const { [compId + '__selected'] : compSelected } = ClientManageCompProps;
    return compSelected.indexOf(id) !== -1;
  }

  handleChangePage = (event, page) => {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    ClientManageCompActions.readClientList(getMergedObject(compListParam, {
      page: page,
      compId: this.props.compId
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    ClientManageCompActions.readClientList(getMergedObject(compListParam, {
      rowsPerPage: event.target.value, 
      page:0,
      compId: this.props.compId
    }));
  };

  // loadInitData = (param) => {
  //   const { ClientManageCompActions, ClientManageCompProps } = this.props;
  //   ClientManageCompActions.readClientList(getMergedObject(ClientManageCompProps.listParam, param));
  // };

  handleKeywordChange = name => event => {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    const newParam = getMergedObject(compListParam, {
      keyword: event.target.value,
      page:0,
      compId: this.props.compId
    });
    ClientManageCompActions.changeStoreData({
      name: compId + '__listParam',
      value: newParam
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__selected'] : preSelected } = ClientManageCompProps;
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

    ClientManageCompActions.changeStoreData({
      name: compId + '__selected',
      value: newSelected
    });

    const selectedItem = ClientManageCompProps[compId + '__listData'].find(function(element) {
      return element.clientId == id;
    });

    if(this.props.onChangeClientSelected) {
      this.props.onChangeClientSelected(selectedItem, newSelected);
    }
  };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageCompActions, ClientManageCompProps, compId } = this.props;
    const { [compId + '__listData'] : compListData, [compId + '__listParam'] : compListParam } = ClientManageCompProps;

    if(checked) {
      const newSelected = compListData.map(n => n.clientId)
      ClientManageCompActions.changeStoreData({
        name: compId + '__selected',
        value: newSelected
      });
      this.props.onChangeClientSelected(compId, newSelected);
    } else {
      ClientManageCompActions.changeStoreData({
        name: compId + '__selected',
        value: []
      });
      this.props.onChangeClientSelected(compId, []);
    }
  };

  render() {
    const { classes } = this.props;
    const { ClientManageCompProps, compId } = this.props;
    const emptyRows = 0;// = ClientManageCompProps.listParam.rowsPerPage - ClientManageCompProps.listData.length;

    const { [compId + '__listData'] : compListData, [compId + '__listParam'] : compListParam, [compId + '__selected'] : compSelected } = ClientManageCompProps;

    return (

      <div>
        <Table>
          <ClientManageHead
            classes={classes}
            onSelectAllClick={this.handleSelectAllClick}
            orderDir={compListParam && compListParam.orderDir}
            orderColumn={compListParam && compListParam.orderColumn}
            onRequestSort={this.handleRequestSort}
            selectedData={compSelected}
            listData={compListData}
          />
          <TableBody>
            {compListData && compListData
              .map(n => {
                const isSelected = this.isSelected(n.clientId);
                return (
                  <TableRow
                    className={classes.grNormalTableRow}
                    hover
                    onClick={event => this.handleRowClick(event, n.clientId)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.clientId}
                    selected={isSelected}
                  >
                    <TableCell
                      padding="checkbox"
                      className={classes.grSmallAndClickCell}
                    >
                      <Checkbox
                        checked={isSelected}
                        className={classes.grObjInCell}
                      />
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.clientStatus}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.clientName}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.loginId}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {n.clientGroupName}
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
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
        {compListParam && 
          <TablePagination
            component='div'
            count={compListParam && compListParam.rowsFiltered}
            rowsPerPage={compListParam && compListParam.rowsPerPage}
            rowsPerPageOptions={compListParam && compListParam.rowsPerPageOptions}
            page={compListParam && compListParam.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        }
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageCompProps: state.ClientManageCompModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageCompActions: bindActionCreators(ClientManageCompActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManage));

