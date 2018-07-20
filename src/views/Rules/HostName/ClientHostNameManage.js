import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientHostNameManageDialog from './ClientHostNameManageDialog';
import ClientHostNameManageInform from './ClientHostNameManageInform';
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
class ClientHostNameHead extends Component {

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
          {ClientHostNameHead.columnData.map(column => {
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
class ClientHostNameManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameList(getMergedObject(ClientHostNameProps.listParam, param));
  };
  
  handleCreateButton = () => {
    const { ClientHostNameActions } = this.props;
    ClientHostNameActions.showDialog({
      selectedItem: {
        objId: '',
        objNm: '',
        comment: '',
        useHypervisor: false,
        pollingTime: '',
        selectedNtpIndex: -1,
        ntpAddress: ['']
      },
      dialogType: ClientHostNameManageDialog.TYPE_ADD
    });
  }

  setParameterForView = (param) => {
    let hosts = '';
    param.propList.forEach(function(e) {
      if(e.propNm == 'HOSTS') {
        hosts = e.propValue;
      }
    });

    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      hosts: hosts
    };
  }
  
  handleRowClick = (event, id) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const selectedItem = ClientHostNameProps.listData.find(function(element) {
      return element.objId == id;
    });
    
    const viewItem = this.setParameterForView(selectedItem);

    // choice one from two views.

    // 1. popup dialog
    // ClientHostNameActions.showDialog({
    //   selectedItem: viewItem,
    //   dialogType: ClientHostNameManageDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientHostNameActions.showInform({
      selectedItem: viewItem  
    });
    
  };

  handleEditClick = (event, id) => {
    //event.stopPropagation();
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const selectedItem = ClientHostNameProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientHostNameActions.showDialog({
      selectedItem: this.setParameterForView(selectedItem),
      dialogType: ClientHostNameManageDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientHostNameProps, ClientHostNameActions, GrConfirmActions } = this.props;

    const selectedItem = ClientHostNameProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientHostNameActions.setSelectedItemObj({
      selectedItem: Object.assign(ClientHostNameProps.selectedItem, selectedItem)
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: 'Hosts 정보 삭제',
      confirmMsg: 'Hosts 정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;

    if(confirmValue) {
      ClientHostNameActions.deleteClientHostNameData({
        objId: ClientHostNameProps.selectedItem.objId
      }).then(() => {
        ClientHostNameActions.readClientHostNameList(ClientHostNameProps.listParam);
        }, () => {
      });
    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameList(getMergedObject(ClientHostNameProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    ClientHostNameActions.readClientHostNameList(getMergedObject(ClientHostNameProps.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    let orderDir = "desc";
    if (ClientHostNameProps.listParam.orderColumn === property && ClientHostNameProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientHostNameActions.readClientHostNameList(getMergedObject(ClientHostNameProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    const newParam = getMergedObject(ClientHostNameProps.listParam, {keyword: event.target.value});
    ClientHostNameActions.changeStoreData({
      name: 'listParam',
      value: newParam
    });
  }

  render() {

    const { ClientHostNameProps } = this.props;
    const emptyRows = ClientHostNameProps.listParam.rowsPerPage - ClientHostNameProps.listData.length;

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
              onClick={ () => this.handleSelectBtnClick({pageNo: 0}) }
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

              <ClientHostNameHead
                orderDir={ClientHostNameProps.listParam.orderDir}
                orderColumn={ClientHostNameProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {ClientHostNameProps.listData.map(n => {
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
                      colSpan={ClientHostNameHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={ClientHostNameProps.listParam.rowsFiltered}
            rowsPerPage={ClientHostNameProps.listParam.rowsPerPage}
            rowsPerPageOptions={ClientHostNameProps.listParam.rowsPerPageOptions}
            page={ClientHostNameProps.listParam.page}
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
        <ClientHostNameManageInform />
        <ClientHostNameManageDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientHostNameManage);
