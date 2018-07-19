import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from '/modules/ClientConfSettingModule';
import * as GrConfirmActions from '/modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';

import { formatDateToSimple } from '/components/GrUtils/GrDates';
import { getMergedObject } from '/components/GrUtils/GrCommonUtils';

import { setParameterForView } from './ClientConfSettingInform';

import GrPageHeader from '/containers/GrContent/GrPageHeader';
import GrConfirm from '/components/GrComponents/GrConfirm';

import ClientConfSettingDialog from './ClientConfSettingDialog';
import ClientConfSettingInform from './ClientConfSettingInform';
import GrPane from '/containers/GrContent/GrPane';

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
class ClientConfSettingHead extends Component {

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
          {ClientConfSettingHead.columnData.map(column => {
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
class ClientConfSetting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, param));
  };
  
  handleCreateButton = () => {
    const { ClientConfSettingActions } = this.props;
    ClientConfSettingActions.showDialog({
      selectedItem: {
        objId: '',
        objNm: '',
        comment: '',
        useHypervisor: false,
        pollingTime: '',
        selectedNtpIndex: -1,
        ntpAddress: ['']
      },
      dialogType: ClientConfSettingDialog.TYPE_ADD
    });
  }

  // setParameterForView = (param) => {
  //   let pollingTime = '';
  //   let useHypervisor = false;
  //   let selectedNtpIndex = -1;
  //   let ntpAddrSelected = '';
  //   let ntpAddress = [];
  //   param.propList.forEach(function(e) {
  //     if(e.propNm == 'AGENTPOLLINGTIME') {
  //       pollingTime = e.propValue;
  //     } else if(e.propNm == 'USEHYPERVISOR') {
  //       useHypervisor = (e.propValue == "true");
  //     } else if(e.propNm == 'NTPSELECTADDRESS') {
  //       ntpAddrSelected = e.propValue;
  //     } else if(e.propNm == 'NTPADDRESSES') {
  //       ntpAddress.push(e.propValue);
  //     }
  //   });
  //   ntpAddress.forEach(function(e, i) {
  //     if(ntpAddrSelected == e) {
  //       selectedNtpIndex = i;
  //     }
  //   });

  //   return {
  //     objId: param.objId,
  //     objNm: param.objNm,
  //     comment: param.comment,
  //     modDate: param.modDate,
  //     useHypervisor: useHypervisor,
  //     pollingTime: pollingTime,
  //     selectedNtpIndex: selectedNtpIndex,
  //     ntpAddress: ntpAddress
  //   };

  // }
  
  handleRowClick = (event, id) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const selectedItem = ClientConfSettingProps.listData.find(function(element) {
      return element.objId == id;
    });
    
    const viewItem = setParameterForView(selectedItem);

    // choice one from two views.

    // 1. popup dialog
    // ClientConfSettingActions.showDialog({
    //   selectedItem: viewItem,
    //   dialogType: ClientConfSettingDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientConfSettingActions.showInform({
      selectedItem: viewItem  
    });
    
  };

  handleEditClick = (event, id) => {
    //event.stopPropagation();
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const selectedItem = ClientConfSettingProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientConfSettingActions.showDialog({
      selectedItem: setParameterForView(selectedItem),
      dialogType: ClientConfSettingDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientConfSettingProps, ClientConfSettingActions, GrConfirmActions } = this.props;

    const selectedItem = ClientConfSettingProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientConfSettingActions.setSelectedItemObj({
      selectedItem: Object.assign(ClientConfSettingProps.selectedItem, selectedItem)
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;

    if(confirmValue) {
      ClientConfSettingActions.deleteClientConfSettingData({
        objId: ClientConfSettingProps.selectedItem.objId
      }).then(() => {
        ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
        }, () => {
      });
    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    let orderDir = "desc";
    if (ClientConfSettingProps.listParam.orderColumn === property && ClientConfSettingProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const newParam = getMergedObject(ClientConfSettingProps.listParam, {keyword: event.target.value});
    ClientConfSettingActions.changeStoreData({
      name: 'listParam',
      value: newParam
    });
  }

  render() {

    const { ClientConfSettingProps } = this.props;
    const emptyRows = ClientConfSettingProps.listParam.rowsPerPage - ClientConfSettingProps.listData.length;

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

              <ClientConfSettingHead
                orderDir={ClientConfSettingProps.listParam.orderDir}
                orderColumn={ClientConfSettingProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {ClientConfSettingProps.listData.map(n => {
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
                      colSpan={ClientConfSettingHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={ClientConfSettingProps.listParam.rowsFiltered}
            rowsPerPage={ClientConfSettingProps.listParam.rowsPerPage}
            rowsPerPageOptions={ClientConfSettingProps.listParam.rowsPerPageOptions}
            page={ClientConfSettingProps.listParam.page}
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
        <ClientConfSettingInform />
        <ClientConfSettingDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientConfSetting);
