import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { refreshDataListInComp, getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import { generateConfigObject } from './ClientConfSettingInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

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
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSetting extends Component {

  columnHeaders = [
    { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: '구분' },
    { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: '정책이름' },
    { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: '정책아이디' },
    { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: '수정자' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps, this.props.match.params.grMenuId);
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientConfSettingActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }
  
  handleRowClick = (event, id) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const selectedViewItem = getRowObjectById(ClientConfSettingProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // ClientConfSettingActions.showDialog({
    //   selectedViewItem: viewObject,
    //   dialogType: ClientConfSettingDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    ClientConfSettingActions.showInform({
      compId: compId,
      selectedViewItem: selectedViewItem
    });
    
  };

  handleCreateButton = () => {
    this.props.ClientConfSettingActions.showDialog({
      selectedViewItem: Map(),
      dialogType: ClientConfSettingDialog.TYPE_ADD
    });
  }

  handleEditClick = (event, id) => { 
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientConfSettingProps, this.props.match.params.grMenuId, id, 'objId');

    ClientConfSettingActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { ClientConfSettingProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientConfSettingProps, this.props.match.params.grMenuId, id, 'objId');
    GrConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + selectedViewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
      ClientConfSettingActions.deleteClientConfSettingData({
        objId: confirmObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComp(ClientConfSettingProps, ClientConfSettingActions.readClientConfSettingListPaged);
      });
    }
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;//ClientConfSettingProps.listParam.rowsPerPage - ClientConfSettingProps.listData.length;

    const listObj = ClientConfSettingProps.getIn(['viewItems', compId]);

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6}>
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Button size="small" variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
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
                keyId="objId"
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
                      onClick={event => this.handleRowClick(event, n.get('objId'))}
                      key={n.get('objId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId').endsWith('DEFAULT') ? '기본' : '일반'}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>

                        <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleEditClick(event, n.get('objId'))}>
                          <BuildIcon />
                        </Button>

                        <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
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
        <ClientConfSettingInform compId={compId} />
        <ClientConfSettingDialog compId={compId} />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientConfSetting));



