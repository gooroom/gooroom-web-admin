import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import { createViewObject } from './ClientHostNameManageInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientHostNameManageDialog from './ClientHostNameManageDialog';
import ClientHostNameManageInform from './ClientHostNameManageInform';
import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';
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

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

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
    const { classes } = this.props;
    const { orderDir, orderColumn, } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientHostNameHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
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
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;


    ClientHostNameActions.readClientHostNameList(getMergedObject(listParam, {
      page: 0,
      compId: menuCompId
    }));

  };
  
  handleCreateButton = () => {
    const { ClientHostNameActions } = this.props;
    ClientHostNameActions.showDialog({
      selectedItem: {
        objId: '',
        objNm: '',
        comment: '',
        hosts: ''
      },
      dialogType: ClientHostNameManageDialog.TYPE_ADD
    });
  }
  
  handleRowClick = (event, id) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    // choice one from two views.

    // 1. popup dialog
    // ClientHostNameActions.showDialog({
    //   selectedItem: viewItem,
    //   dialogType: ClientHostNameManageDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientHostNameActions.showInform({
      compId: menuCompId,
      selectedItem: selectedItem
    });
    
  };

  handleEditClick = (event, id) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    ClientHostNameActions.showDialog({
      compId: menuCompId,
      selectedItem: createViewObject(selectedItem),
      dialogType: ClientHostNameManageDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientHostNameProps, ClientHostNameActions, GrConfirmActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listData = (viewItem) ? viewItem.listData : [];


    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    const re = GrConfirmActions.showConfirm({
      confirmTitle: 'Hosts 정보 삭제',
      confirmMsg: 'Hosts 정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {

    if(confirmValue) {
      const { ClientHostNameProps, ClientHostNameActions } = this.props;

      ClientHostNameActions.deleteClientHostNameData({
        objId: paramObject.objId
      }).then(() => {

        const { editingCompId, viewItems } = ClientHostNameProps;
        viewItems.forEach((element) => {
          if(element && element.listParam) {
            ClientHostNameActions.readClientHostNameList(getMergedObject(element.listParam, {
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
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;

    
    ClientHostNameActions.readClientHostNameList(getMergedObject(listParam, {
      page: page,
      compId: menuCompId
    }));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;


    ClientHostNameActions.readClientHostNameList(getMergedObject(listParam, {
      rowsPerPage: event.target.value,
      compId: menuCompId
    }));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientHostNameProps, ClientHostNameActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;


    let orderDir = "desc";
    if (listParam.orderColumn === property && listParam.orderDir === "desc") {
      orderDir = "asc";
    }

    ClientHostNameActions.readClientHostNameList(getMergedObject(listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: menuCompId
    }));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientHostNameActions, ClientHostNameProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;


    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId
      });
    }
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;


    const newParam = getMergedObject(listParam, {keyword: event.target.value});
    ClientHostNameActions.changeStoreData({
      name: 'listParam',
      value: newParam,
      compId: menuCompId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientHostNameProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const emptyRows = 0;//ClientHostNameProps.listParam.rowsPerPage - ClientHostNameProps.listData.length;

    let viewItem = null;
    if(ClientHostNameProps.viewItems) {
      viewItem = ClientHostNameProps.viewItems.find((element) => {
        return element._COMPID_ == menuCompId;
      });
    }

    const listData = (viewItem) ? viewItem.listData : [];
    const listParam = (viewItem) ? viewItem.listParam : ClientHostNameProps.defaultListParam;
    const orderDir = (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : ClientHostNameProps.defaultListParam.orderDir;
    const orderColumn = (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : ClientHostNameProps.defaultListParam.orderColumn;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={this.state.keyword}
                  onChange={this.handleKeywordChange('keyword')}
                />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={ () => this.handleSelectBtnClick() }
                >
                  <Search />
                  조회
                </Button>

              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleCreateButton();
                }}
              >
                <AddIcon />
                등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          <div>
            <Table>

              <ClientHostNameHead
                classes={classes}
                orderDir={orderDir}
                orderColumn={orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {listData.map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.objId)}
                      tabIndex={-1}
                      key={n.objId}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>
                      {n.objId.endsWith('DEFAULT') ? '기본' : '일반'}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                      {n.objNm}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                      {n.objId}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                      {n.modUserId}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button variant='fab' color='secondary' aria-label='edit' className={classes.buttonInTableRow} onClick={event => this.handleEditClick(event, n.objId)}>
                          <BuildIcon />
                        </Button>
                        <Button variant='fab' color='secondary' aria-label='delete' className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.objId)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={ClientHostNameHead.columnData.length + 1}
                      className={classes.grSmallAndClickCell}
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
        <ClientHostNameManageInform compId={menuCompId} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameManage));
