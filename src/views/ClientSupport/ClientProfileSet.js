import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientProfileSetDialog from './ClientProfileSetDialog';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

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
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {page: 0});
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
        clientItem: {},
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
      selectedViewItem: selectedViewItem,
      dialogType: ClientProfileSetDialog.TYPE_PROFILE
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    GRConfirmActions.showConfirm({
      confirmTitle: '단말프로파일 삭제',
      confirmMsg: '단말프로파일(' + selectedViewItem.get('profileNo') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
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
  handleKeywordChange = (name, value) => {
    this.props.ClientProfileSetActions.changeListParamData({
      name: name, 
      value: value,
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
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
              <Grid item xs={6} >
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) &&
            <div>
            <Table>
              <GRCommonTableHead
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
        </GRPane>
        {/* dialog(popup) component area */}
        <ClientProfileSetDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
    ClientProfileSetProps: state.ClientProfileSetModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientProfileSet));
