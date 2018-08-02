import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientRegKeyDialog from './ClientRegKeyDialog';
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
class ClientRegKeyHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'chRegKey', isOrder: true, numeric: false, disablePadding: true, label: '단말등록키' },
    { id: 'chValidDate', isOrder: true, numeric: false, disablePadding: true, label: '유효날짜' },
    { id: 'chExpireDate', isOrder: true, numeric: false, disablePadding: true, label: '인증서만료날짜' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  render() {
    const { classes } = this.props;
    const { orderDir, orderColumn } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientRegKeyHead.columnData.map(column => {
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
class ClientRegKey extends Component {

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
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyList(getMergedObject(ClientRegKeyProps.listParam, {
      page: 0,
      compId: ''
    }));
  };
  
  handleCreateButton = () => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.showDialog({
      selectedItem: {
        regKeyNo: '',
        validDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        expireDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        ipRange: '',
        comment: '' 
      },
      dialogType: ClientRegKeyDialog.TYPE_ADD,
      dialogOpen: true
    });
  }
  
  handleRowClick = (event, id) => {
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const selectedItem = ClientRegKeyProps.listData.find(function(element) {
      return element.regKeyNo == id;
    });
    ClientRegKeyActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientRegKeyDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const selectedItem = ClientRegKeyProps.listData.find(function(element) {
      return element.regKeyNo == id;
    });
    ClientRegKeyActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientRegKeyDialog.TYPE_EDIT,
      dialogOpen: true
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, ClientRegKeyActions, GrConfirmActions } = this.props;
    const selectedItem = ClientRegKeyProps.listData.find(function(element) {
      return element.regKeyNo == id;
    });
    ClientRegKeyActions.changeParamValue({
      name: 'regKeyNo',
      value: selectedItem.regKeyNo
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말등록키 삭제',
      confirmMsg: '단말등록키(' + selectedItem.regKeyNo + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    if(confirmValue) {
      ClientRegKeyActions.deleteClientRegKeyData({
        regKeyNo: ClientRegKeyProps.selectedItem.regKeyNo
      }).then(() => {
        ClientRegKeyActions.readClientRegkeyList(ClientRegKeyProps.listParam);
        }, () => {
      });
    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyList(getMergedObject(ClientRegKeyProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyList(getMergedObject(ClientRegKeyProps.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    let orderDir = "desc";
    if (ClientRegKeyProps.listParam.orderColumn === property && ClientRegKeyProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientRegKeyActions.readClientRegkeyList(getMergedObject(ClientRegKeyProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    const newParam = getMergedObject(ClientRegKeyProps.listParam, {keyword: event.target.value});
    ClientRegKeyActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientRegKeyProps } = this.props;
    const emptyRows = ClientRegKeyProps.listParam.rowsPerPage - ClientRegKeyProps.listData.length;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={ClientRegKeyProps.listParam.keyword}
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

              <ClientRegKeyHead
                classes={classes}
                orderDir={ClientRegKeyProps.listParam.orderDir}
                orderColumn={ClientRegKeyProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {ClientRegKeyProps.listData.map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.regKeyNo)}
                      tabIndex={-1}
                      key={n.regKeyNo}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.regKeyNo}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {formatDateToSimple(n.validDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {formatDateToSimple(n.expireDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" aria-label="edit" className={classes.buttonInTableRow} onClick={event => this.handleEditClick(event, n.regKeyNo)}>
                          <BuildIcon />
                        </Button>
                        <Button size="small" color="secondary" aria-label="delete" className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.regKeyNo)}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell
                      colSpan={ClientRegKeyHead.columnData.length + 1}
                      className={classes.grSmallAndClickCell}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component="div"
            count={ClientRegKeyProps.listParam.rowsFiltered}
            rowsPerPage={ClientRegKeyProps.listParam.rowsPerPage}
            rowsPerPageOptions={ClientRegKeyProps.listParam.rowsPerPageOptions}
            page={ClientRegKeyProps.listParam.page}
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
        <ClientRegKeyDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientRegKeyProps: state.ClientRegKeyModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientRegKey));
