import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import { createViewObject } from './ClientUpdateServerManageInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientUpdateServerManageDialog from './ClientUpdateServerManageDialog';
import ClientUpdateServerManageInform from './ClientUpdateServerManageInform';
import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

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
    const { classes } = this.props;
    const { orderDir, orderColumn, } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientUpdateServerHead.columnData.map(column => {
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
class ClientUpdateServerManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }


  // .................................................
  handleSelectBtnClick = () => {
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
    const { classes } = this.props;
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
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6}>
                <FormControl fullWidth={true}>
                  <TextField
                    id='keyword'
                    label='검색어'
                    value={this.state.keyword}
                    onChange={this.handleKeywordChange('keyword')}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
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

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
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

              <ClientUpdateServerHead
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
                      <TableCell className={classes.grSmallAndClickCell}>{n.objId.endsWith('DEFAULT') ? '기본' : '일반'}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.objNm}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.objId}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.modUserId}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.modDate, 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button color='secondary' size="small" className={classes.buttonInTableRow} onClick={event => this.handleEditClick(event, n.objId)}>
                          <BuildIcon />
                        </Button>
                        <Button color='secondary' size="small" className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.objId)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell
                      colSpan={ClientUpdateServerHead.columnData.length + 1}
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientUpdateServerManage));
