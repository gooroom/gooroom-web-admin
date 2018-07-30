import React, { Component } from 'react';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientProfileSetDialog from './ClientProfileSetDialog';
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
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientProfileSetHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'chProfileSetNo', isOrder: true, numeric: false, disablePadding: true, label: '번호' },
    { id: 'chProfileSetName', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chClientId', isOrder: true, numeric: false, disablePadding: true, label: 'Ref단말아이디' },
    { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
    { id: 'chProfile', isOrder: false, numeric: false, disablePadding: true, label: '프로파일' },
  ];

  render() {
    const { orderDir, orderColumn } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientProfileSetHead.columnData.map(column => {
            return (
              <TableCell
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
class ClientProfileSet extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedObject(ClientProfileSetProps.listParam, param));
  };
  
  handleCreateButton = () => {
    this.props.ClientProfileSetActions.showDialog({
      selectedItem: {
        profileNo: '',
        profileNm: '',
        profileCmt: '',
        clientId: '',
        targetClientIds: '',
        targetClientIdArray: [],
        targetGroupIds: '',
        targetGroupIdArray: [],
        isRemoval: 'false'
      },
      dialogType: ClientProfileSetDialog.TYPE_ADD,
      dialogOpen: true
    });
  }
  
  handleRowClick = (event, id) => {
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedItem = ClientProfileSetProps.listData.find(function(element) {
      return element.profileNo == id;
    });
    ClientProfileSetActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientProfileSetDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedItem = ClientProfileSetProps.listData.find(function(element) {
      return element.profileNo == id;
    });
    
    ClientProfileSetActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientProfileSetDialog.TYPE_EDIT,
      dialogOpen: true
    });
  };

  handleProfileClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedItem = ClientProfileSetProps.listData.find(function(element) {
      return element.profileNo == id;
    });
    ClientProfileSetActions.showDialog({
      selectedItem: Object.assign({
        targetClientIds: '',
        targetClientIdArray: [],
        targetGroupIds: '',
        targetGroupIdArray: [],
        isRemoval: 'false'
      }, selectedItem),
      dialogType: ClientProfileSetDialog.TYPE_PROFILE,
      dialogOpen: true
    });
  };

  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions, GrConfirmActions } = this.props;
    const selectedItem = ClientProfileSetProps.listData.find(function(element) {
      return element.profileNo == id;
    });
    ClientProfileSetActions.changeParamValue({
      name: 'profileNo',
      value: selectedItem.profileNo
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말프로파일 삭제',
      confirmMsg: '단말프로파일(' + selectedItem.profileNo + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    if(confirmValue) {
      this.props.ClientProfileSetActions.deleteClientProfileSetData({
        profileNo: ClientProfileSetProps.selectedItem.profileNo
      }).then(() => {
          ClientProfileSetActions.readClientProfileSetList(getMergedObject(ClientProfileSetProps.listParam, {}));
        }, () => {
      });
    }
  };
  
  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedObject(ClientProfileSetProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = (event) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedObject(ClientProfileSetProps.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    let orderDir = "desc";
    if (ClientProfileSetProps.listParam.orderColumn === property && ClientProfileSetProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientProfileSetActions.readClientProfileSetList(getMergedObject(ClientProfileSetProps.listParam, {orderColumn: property, orderDir: orderDir}));
  }
  // .................................................

  handleKeywordChange = name => event => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    const newParam = getMergedObject(ClientProfileSetProps.listParam, {keyword: event.target.value});
    ClientProfileSetActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientProfileSetProps } = this.props;
    const emptyRows = ClientProfileSetProps.listParam.rowsPerPage - ClientProfileSetProps.listData.length;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          {/* data option area */}

          <Grid item xs={12} container alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={6} container alignItems="flex-start" direction="row" justify="flex-start" >
              <Grid item xs={6}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={ClientProfileSetProps.listParam.keyword}
                  onChange={this.handleKeywordChange('keyword')}
                  margin='dense'
                />
              </Grid>

              <Grid item xs={6}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={ () => this.handleSelectBtnClick({page: 0}) }
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

              <ClientProfileSetHead
                orderDir={ClientProfileSetProps.listParam.orderDir}
                orderColumn={ClientProfileSetProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {ClientProfileSetProps.listData.map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.profileNo)}
                      key={n.profileNo}
                    >
                      <TableCell >{n.profileNo}</TableCell>
                      <TableCell >{n.profileNm}</TableCell>
                      <TableCell >{n.clientId}</TableCell>
                      <TableCell >
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell >
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell >

                      <Button 
                        color="secondary" 
                        size="small" 
                        className={classes.buttonInTableRow}
                        onClick={event => this.handleEditClick(event, n.profileNo)}>
                        <BuildIcon />
                      </Button>

                      <Button color="secondary" size="small" 
                        className={classes.buttonInTableRow}
                        onClick={event => this.handleDeleteClick(event, n.profileNo)}>
                        <DeleteIcon />
                      </Button>                        

                      </TableCell>
                      <TableCell >

                      <Button color="secondary" size="small" 
                        className={classes.buttonInTableRow}
                        onClick={event => this.handleProfileClick(event, n.profileNo)}>
                        <AssignmentIcon />
                      </Button>                        

                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={ClientProfileSetHead.columnData.length + 1}
                      
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={ClientProfileSetProps.listParam.rowsFiltered}
            rowsPerPage={ClientProfileSetProps.listParam.rowsPerPage}
            page={ClientProfileSetProps.listParam.page}
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
        <ClientProfileSetDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
    ClientProfileSetProps: state.ClientProfileSetModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientProfileSet));
