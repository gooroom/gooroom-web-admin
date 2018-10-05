import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

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

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class ClientProfileSet extends Component {
  
  columnHeaders = [
    { id: 'chProfileSetNo', isOrder: true, numeric: false, disablePadding: true, label: '번호' },
    { id: 'chProfileSetName', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chClientId', isOrder: true, numeric: false, disablePadding: true, label: 'Ref단말아이디' },
    { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
    { id: 'chProfile', isOrder: false, numeric: false, disablePadding: true, label: '프로파일' },
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId);
  };

  handleRowClick = (event, id) => {
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    ClientProfileSetActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientProfileSetDialog.TYPE_VIEW
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.ClientProfileSetActions.showDialog({
      selectedViewItem: {
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
      dialogType: ClientProfileSetDialog.TYPE_ADD
    });
  }
  
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    ClientProfileSetActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientProfileSetDialog.TYPE_EDIT
    });
  };

  handleProfileClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    ClientProfileSetActions.showDialog({
      selectedViewItem: {
        profileNo: selectedViewItem.get('profileNo'),
        profileNm: selectedViewItem.get('profileNm'),
        profileCmt: selectedViewItem.get('profileCmt'),
        targetClientIds: '',
        targetClientIdArray: [],
        targetGroupIds: '',
        targetGroupIdArray: [],
        isRemoval: 'false'
      },
      dialogType: ClientProfileSetDialog.TYPE_PROFILE
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    GrConfirmActions.showConfirm({
      confirmTitle: '단말프로파일 삭제',
      confirmMsg: '단말프로파일(' + selectedViewItem.get('profileNo') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientProfileSetActions.deleteClientProfileSetData({
        compId: compId,
        profileNo: confirmObject.get('profileNo')
      }).then(() => {
          ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
      });
    }
  };
  
  // .................................................
  handleKeywordChange = name => event => {
    this.props.ClientProfileSetActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientProfileSetProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;

    const listObj = ClientProfileSetProps.getIn(['viewItems', compId]);

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
                keyId="profileNo"
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
                      onClick={event => this.handleRowClick(event, n.get('profileNo'))}
                      key={n.get('profileNo')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('profileNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('profileNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.get('profileNo'))}>
                          <BuildIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('profileNo'))}>
                          <DeleteIcon />
                        </Button>                        
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleProfileClick(event, n.get('profileNo'))}>
                          <AssignmentIcon />
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
        <ClientProfileSetDialog compId={compId} />
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
