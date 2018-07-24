import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import { createViewObject } from './ClientUpdateServerManageInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientUpdateServerManageDialog from './ClientUpdateServerManageDialog';
import ClientUpdateServerManageInform from './ClientUpdateServerManageInform';
import GrPane from 'containers/GrContent/GrPane';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';



//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ##########
//
const formClass = css({
  marginBottom: '6px !important',
    display: 'flex'
}).toString();

const formControlClass = css({
  minWidth: '100px !important',
    marginRight: '15px !important',
    flexGrow: 1
}).toString();

const formEmptyControlClass = css({
  flexGrow: '6 !important'
}).toString();

const textFieldClass = css({
  marginTop: '3px !important'
}).toString();

const buttonClass = css({
  margin: theme.spacing.unit + ' !important'
}).toString();

const leftIconClass = css({
  marginRight: theme.spacing.unit + ' !important'
}).toString();

const tableClass = css({
  minWidth: '700px !important'
}).toString();

const tableContainerClass = css({
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    position: 'absolute',
    height: 10,
    marginLeft: '-10px',
    },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#CFD8DC', 
    },
  '&::-webkit-scrollbar-thumb': {
    height: '30px',
    backgroundColor: '#78909C',
    backgroundClip: 'content-box',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '1px 1px',
    }
}).toString();

const tableRowClass = css({
  height: '2em !important'
}).toString();

const tableCellClass = css({
  height: '1em !important',
  padding: '0px !important',
  cursor: 'pointer'
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
class ClientUpdateServerHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: '구분' },
    { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: '정책이름' },
    { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: '정책아이디' },
    { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: '수정자' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  render() {
    const { orderDir, orderColumn, } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientUpdateServerHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
                key={column.id}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel
                  active={orderColumn === column.id}
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
class ClientUpdateServerManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientUpdateServerActions, ClientUpdateServerProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;


    ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(listParam, {
      page: 0,
      compId: menuCompId
    }));
  };
  
  handleCreateButton = () => {
    const { ClientUpdateServerActions } = this.props;
    ClientUpdateServerActions.showDialog({
      selectedItem: {
        objId: '',
        objNm: '',
        comment: '',
        mainos: '',
        extos: '',
        priorities: ''
      },
      dialogType: ClientUpdateServerManageDialog.TYPE_ADD
    });
  }

  handleRowClick = (event, id) => {
    const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    // choice one from two views.

    // 1. popup dialog
    // ClientUpdateServerActions.showDialog({
    //   selectedItem: viewItem,
    //   dialogType: ClientUpdateServerManageDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientUpdateServerActions.showInform({
      compId: menuCompId,
      selectedItem: selectedItem
    });
    
  };

  handleEditClick = (event, id) => {
    const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    ClientUpdateServerActions.showDialog({
      compId: menuCompId,
      selectedItem: createViewObject(selectedItem),
      dialogType: ClientUpdateServerManageDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientUpdateServerProps, ClientUpdateServerActions, GrConfirmActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    const re = GrConfirmActions.showConfirm({
      confirmTitle: '업데이트서버 정보 삭제',
      confirmMsg: '업데이트서버 정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {

    if(confirmValue) {
      const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;

      ClientUpdateServerActions.deleteClientUpdateServerData({
        objId: paramObject.objId
      }).then(() => {

        const { editingCompId, viewItems } = ClientUpdateServerProps;
        viewItems.forEach((element) => {
          if(element && element.listParam) {
            ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(element.listParam, {
              compId: element._COMPID_
            }));
          }
        });

      }, () => {
      });

    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientUpdateServerActions, ClientUpdateServerProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;

    
    ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(listParam, {
      page: page,
      compId: menuCompId
    }));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientUpdateServerActions, ClientUpdateServerProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;


    ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(listParam, {
      rowsPerPage: event.target.value,
      compId: menuCompId
    }));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;


    let orderDir = "desc";
    if (listParam.orderColumn === property && listParam.orderDir === "desc") {
      orderDir = "asc";
    }

    ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: menuCompId
    }));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientUpdateServerActions, ClientUpdateServerProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;


    const newParam = getMergedObject(listParam, {keyword: event.target.value});
    ClientUpdateServerActions.changeStoreData({
      name: 'listParam',
      value: newParam,
      compId: menuCompId
    });
  }

  render() {

    const { ClientUpdateServerProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const emptyRows = 0;//ClientUpdateServerProps.listParam.rowsPerPage - ClientUpdateServerProps.listData.length;

    let viewItem = null;
    if(ClientUpdateServerProps.viewItems) {
      viewItem = ClientUpdateServerProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId;
      });
    }

    const listData = (viewItem) ? viewItem.listData : [];
    const listParam = (viewItem) ? viewItem.listParam : ClientUpdateServerProps.defaultListParam;
    const orderDir = (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : ClientUpdateServerProps.defaultListParam.orderDir;
    const orderColumn = (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : ClientUpdateServerProps.defaultListParam.orderColumn;

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
                value={this.state.keyword}
                onChange={this.handleKeywordChange('keyword')}
                margin='dense'
              />
            </FormControl>
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='primary'
              onClick={ () => this.handleSelectBtnClick() }
            >
              <Search className={leftIconClass} />
              조회
            </Button>

            <div className={formEmptyControlClass} />

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='secondary'
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

              <ClientUpdateServerHead
                orderDir={orderDir}
                orderColumn={orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.objId)}
                      tabIndex={-1}
                      key={n.objId}
                    >
                      <TableCell className={tableCellClass}>
                      {n.objId.endsWith('DEFAULT') ? '기본' : '일반'}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                      {n.objNm}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                      {n.objId}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                      {n.modUserId}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        <Button variant='fab' color='secondary' aria-label='edit' className={actButtonClass} onClick={event => this.handleEditClick(event, n.objId)}>
                          <BuildIcon className={toolIconClass} />
                        </Button>
                        <Button variant='fab' color='secondary' aria-label='delete' className={actButtonClass} onClick={event => this.handleDeleteClick(event, n.objId)}>
                          <DeleteIcon className={toolIconClass} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={ClientUpdateServerHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={listParam.rowsFiltered}
            rowsPerPage={listParam.rowsPerPage}
            rowsPerPageOptions={listParam.rowsPerPageOptions}
            page={listParam.page}
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
        {/* dialog(popup) component area */}
        <ClientUpdateServerManageInform compId={menuCompId} />
        <ClientUpdateServerManageDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientUpdateServerManage);
