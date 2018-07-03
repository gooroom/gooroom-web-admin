import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

import GrPageHeader from '../../containers/GrContent/GrPageHeader';

import GrPane from '../../containers/GrContent/GrPane';
import GrConfirm from '../../components/GrComponents/GrConfirm';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search'; 
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import ClientGroupDialog from './ClientGroupDialog';
import ClientGroupSelect from '../Options/ClientGroupSelect';
import ClientGroupInform from './ClientGroupInform';

import ClientStatusSelect from '../Options/ClientStatusSelect';


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

const actButtonClass = css({
  margin: '5px !important',
  height: '24px !important',
  minHeight: '24px !important',
  width: '24px !important',
}).toString();

const toolIconClass = css({
  height: '16px !important',
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
    console.log("componentDidMount");
    this.handleSelectBtnClick({page:0});
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
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.grpId) });
      return;
    }
    this.setState({ selected: [] });
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
  // .................................................

  // add
  handleCreateButton = () => {
    this.props.ClientGroupActions.showDialog({
      selectedItem: {
        grpNm: '',
        comment: '',
        clientConfigId: '',
        isDefault: ''
      },
      dialogType: ClientGroupDialog.TYPE_ADD,
      dialogOpen: true
    });
  }

  // edit
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientGroupDialog.TYPE_EDIT,
      dialogOpen: true
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.setSelectedItem({
      selectedItem: selectedItem
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말그룹 삭제',
      confirmMsg: '단말그룹(' + selectedItem.grpNm + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };

  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    if(confirmValue) {
      ClientGroupActions.deleteClientGroupData({
        groupId: ClientGroupProps.selectedItem.grpId
      }).then(() => {
        ClientGroupActions.readClientGroupList(ClientGroupProps.listParam);
        }, () => {
        });
    }
  };

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, param));
  };
  
  handleKeywordChange = name => event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const newParam = getMergedListParam(ClientGroupProps.listParam, {keyword: event.target.value});
    ClientGroupActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }

  // .................................................
  handleChangeGroupSelect = (event, property) => {
    console.log(' handleChangeGroupSelect : ', property);
  };
  handleChangeClientStatusSelect = (event, property) => {
    console.log(' handleChangeClientStatusSelect : ', property);
  };

  render() {

    const { ClientGroupProps } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    return (

      <React.Fragment>
        <GrPane>
          {/* data area */}
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
          </div>

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

        </GrPane>
      </React.Fragment>

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


