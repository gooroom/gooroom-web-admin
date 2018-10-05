import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from 'modules/ClientRegKeyModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

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

class ClientRegKey extends Component {

  columnHeaders = [
    { id: 'chRegKey', isOrder: true, numeric: false, disablePadding: true, label: '단말등록키' },
    { id: 'chValidDate', isOrder: true, numeric: false, disablePadding: true, label: '유효날짜' },
    { id: 'chExpireDate', isOrder: true, numeric: false, disablePadding: true, label: '인증서만료날짜' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    this.props.ClientRegKeyActions.readClientRegkeyListPaged(this.props.ClientRegKeyProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientRegKeyActions.readClientRegkeyListPaged(this.props.ClientRegKeyProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientRegKeyActions.readClientRegkeyListPaged(this.props.ClientRegKeyProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, this.props.match.params.grMenuId);
  };
  
  handleRowClick = (event, id) => {
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    ClientRegKeyActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientRegKeyDialog.TYPE_VIEW
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.ClientRegKeyActions.showDialog({
      selectedViewItem: {
        regKeyNo: '',
        validDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        expireDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        ipRange: '',
        comment: '' 
      },
      dialogType: ClientRegKeyDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    ClientRegKeyActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientRegKeyDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientRegKeyProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientRegKeyProps, this.props.match.params.grMenuId, id, 'regKeyNo');
    GrConfirmActions.showConfirm({
      confirmTitle: '단말등록키 삭제',
      confirmMsg: '단말등록키(' + selectedViewItem.get('regKeyNo') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientRegKeyActions.deleteClientGroupData({
        compId: compId,
        regKeyNo: confirmObject.get('regKeyNo')
      }).then(() => {
        ClientRegKeyActions.readClientRegkeyListPaged(ClientRegKeyProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = name => event => {
    this.props.ClientRegKeyActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientRegKeyProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    const listObj = ClientRegKeyProps.getIn(['viewItems', compId]);

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
              <Grid item xs={6} >
                <FormControl fullWidth={true}>
                  <TextField id='keyword' label='검색어' onChange={this.handleKeywordChange('keyword')} />
                </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) &&
            <div>
            <Table>
              <GrCommonTableHead
                classes={classes}
                keyId="regKeyNo"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.get('regKeyNo'))}
                      key={n.get('regKeyNo')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('regKeyNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('validDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('expireDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('regKeyNo'))}>
                          <BuildIcon />
                        </Button>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('regKeyNo'))}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell colSpan={this.columnHeaders.length + 1} className={classes.grSmallAndClickCell} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              component='div'
              count={listObj.getIn(['listParam', 'rowsFiltered'])}
              rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
              rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
              page={listObj.getIn(['listParam', 'page'])}
              backIconButtonProps={{
                'aria-label': 'Previous Page'
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page'
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            </div>
          }
        </GrPane>
        {/* dialog(popup) component area */}
        <ClientRegKeyDialog compId={compId} />
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
