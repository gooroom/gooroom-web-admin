import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupCompModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

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

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search'; 
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import ClientGroupDialog from './ClientGroupDialog';
import ClientGroupInform from './ClientGroupInform';

import ClientGroupComp from './ClientGroupComp';


//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ########## 
//
const contentClass = css({
  height: "100% !important"
}).toString();

const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const formClass = css({
  marginBottom: "6px !important",
    display: "flex"
}).toString();

const formControlClass = css({
  minWidth: "100px !important",
    marginRight: "15px !important",
    flexGrow: 1
}).toString();

const formEmptyControlClass = css({
  flexGrow: "6 !important"
}).toString();

const textFieldClass = css({
  marginTop: "3px !important"
}).toString();

const buttonClass = css({
  margin: theme.spacing.unit + " !important"
}).toString();

const leftIconClass = css({
  marginRight: theme.spacing.unit + " !important"
}).toString();


const tableClass = css({
  minWidth: "700px !important"
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




const tempClass = css({
  width: '300px !important',
  border: '1px solid red'
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
    { id: "chDesktopConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "chClientConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "단말정책" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  render() {
    const { orderDir, orderColumn } = this.props;

    return (
      <TableHead>
        <TableRow>
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

  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    let orderDir = "desc";
    if (ClientGroupProps.listParam.orderColumn === property && ClientGroupProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: ''
    }));
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.showClientGroupInform({
      selectedItem: Object.assign({}, selectedItem),
    });
  };

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {
      page: page,
      compId: ''
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(ClientGroupProps.listParam, {
      rowsPerPage: event.target.value,
      page: 0,
      compId: ''
    }));
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
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
      dialogType: ClientGroupDialog.TYPE_ADD
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
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, GrConfirmActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.setSelectedItemObj({
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
    const newParam = getMergedListParam(ClientGroupProps.listParam, {
      keyword: event.target.value,
      compId: ''
    });
    ClientGroupActions.changeStoreData({name: 'listParam', value: newParam});
  }

  // .................................................
  handleChangeGroupSelect = (event, property) => {

  };
  handleChangeClientStatusSelect = (event, property) => {

  };

  render() {

    const { ClientGroupProps } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>

          {/* data option area */}
          <form className={formClass}>
            <FormControl className={formControlClass} autoComplete='off'>
              <TextField
                id='keyword'
                label='검색어'
                className={textFieldClass}
                value={ClientGroupProps.listParam.keyword}
                onChange={this.handleKeywordChange('keyword')}
                margin='dense'
              />
            </FormControl>

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='primary'
              onClick={() => this.handleSelectBtnClick({
                page: 0,
                compId: ''
              })}
            >
              <Search className={leftIconClass} />
              조회
            </Button>
            <div className={formEmptyControlClass} />
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant="raised"
              color="secondary"
              onClick={() => {
                this.handleCreateButton();
              }}
            >
              <AddIcon className={leftIconClass} />
              등록
            </Button>
          </form>

          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <ClientGroupManageHead
                orderDir={ClientGroupProps.listParam.orderDir}
                orderColumn={ClientGroupProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
              {ClientGroupProps.listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.grpId)}
                      key={n.grpId}
                    >
                      <TableCell className={tableCellClass}>
                        {n.grpNm}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.clientCount}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.desktopConfigNm}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.clientConfigNm}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        <Button variant='fab' color='secondary' aria-label='edit' className={actButtonClass} onClick={event => this.handleEditClick(event, n.grpId)}>
                          <BuildIcon className={toolIconClass} />
                        </Button>
                        <Button variant='fab' color='secondary' aria-label='delete' className={actButtonClass} onClick={event => this.handleDeleteClick(event, n.grpId)}>
                          <DeleteIcon className={toolIconClass} />
                        </Button>
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
            rowsPerPageOptions={ClientGroupProps.listParam.rowsPerPageOptions}
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
        <ClientGroupInform />
        <ClientGroupInform 
            isOpen={ClientGroupProps.informOpen} 
            selectedItem={ClientGroupProps.selectedItem}
          />
        <ClientGroupDialog />
        <GrConfirm />
      </React.Fragment>


    );
  }
}

const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupCompModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupManage);


