import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, getListParam, getListData, getViewItem } from 'components/GrUtils/GrCommonUtils';

import { createViewObject } from './ClientConfSettingInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientConfSettingDialog from './ClientConfSettingDialog';
import ClientConfSettingInform from './ClientConfSettingInform';
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
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  render() {
    const { classes } = this.props;
    const { orderDir, orderColumn, } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientConfSettingHead.columnData.map(column => {
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
class ClientConfSetting extends Component {

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
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: ClientConfSettingProps, compId: menuCompId });
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(listParam, {
      page: 0,
      compId: menuCompId
    }));
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
  
  handleRowClick = (event, id) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listData = getListData({ props: ClientConfSettingProps, compId: menuCompId });
    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    // choice one from two views.

    // 1. popup dialog
    // ClientConfSettingActions.showDialog({
    //   selectedItem: viewObject,
    //   dialogType: ClientConfSettingDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientConfSettingActions.showInform({
      compId: menuCompId,
      selectedItem: selectedItem
    });
    
  };

  handleEditClick = (event, id) => { 
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listData = getListData({ props: ClientConfSettingProps, compId: menuCompId });
    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    ClientConfSettingActions.showDialog({
      compId: menuCompId,
      selectedItem: createViewObject(selectedItem),
      dialogType: ClientConfSettingDialog.TYPE_EDIT,
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientConfSettingProps, ClientConfSettingActions, GrConfirmActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listData = getListData({ props: ClientConfSettingProps, compId: menuCompId });
    const selectedItem = listData.find(function(element) {
      return element.objId == id;
    });

    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {

    if(confirmValue) {
      const { ClientConfSettingProps, ClientConfSettingActions } = this.props;

      ClientConfSettingActions.deleteClientConfSettingData({
        objId: paramObject.objId
      }).then((res) => {

        const { editingCompId, viewItems } = ClientConfSettingProps;
        viewItems.forEach((element) => {
          if(element && element.listParam) {
            ClientConfSettingActions.readClientConfSettingList(getMergedObject(element.listParam, {
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
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: ClientConfSettingProps, compId: menuCompId });
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(listParam, {
      page: page,
      compId: menuCompId
    }));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: ClientConfSettingProps, compId: menuCompId });
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(listParam, {
      rowsPerPage: event.target.value,
      page: 0,
      compId: menuCompId
    }));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: ClientConfSettingProps, compId: menuCompId });
    let orderDir = "desc";
    if (listParam.orderColumn === property && listParam.orderDir === "desc") {
      orderDir = "asc";
    }

    ClientConfSettingActions.readClientConfSettingList(getMergedObject(listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: menuCompId
    }));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listParam = getListParam({ props: ClientConfSettingProps, compId: menuCompId });
    ClientConfSettingActions.changeStoreData({
      name: 'listParam',
      value: getMergedObject(listParam, {keyword: event.target.value}),
      compId: menuCompId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const emptyRows = 0;//ClientConfSettingProps.listParam.rowsPerPage - ClientConfSettingProps.listData.length;

    const viewItem = getViewItem({
      props: ClientConfSettingProps,
      compId: menuCompId
    });

    const listData = (viewItem) ? viewItem.listData : [];
    const listParam = (viewItem) ? viewItem.listParam : ClientConfSettingProps.defaultListParam;
    const orderDir = (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : ClientConfSettingProps.defaultListParam.orderDir;
    const orderColumn = (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : ClientConfSettingProps.defaultListParam.orderColumn;
    
    return (
      <div>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={this.state.keyword}
                  onChange={this.handleKeywordChange('keyword')}
                  margin='dense'
                />
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

              <ClientConfSettingHead
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

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.objId)}>
                          <BuildIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.objId)}>
                          <DeleteIcon />
                        </Button>                        

                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell
                      colSpan={ClientConfSettingHead.columnData.length + 1}
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
        <ClientConfSettingInform compId={menuCompId} />
        <ClientConfSettingDialog />
        <GrConfirm />
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSetting));



