import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as ClientDesktopConfigActions from 'modules/ClientDesktopConfigModule';

import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

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

import ClientGroupDialog from './ClientGroupDialog';
import ClientGroupInform from './ClientGroupInform';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class ClientGroupManage extends Component {

  columnHeaders = [
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
    { id: "chDesktopConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "chClientConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "단말정책" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const clickedRowObject = getRowObjectById(ClientGroupProps, compId, id, 'grpId');

    ClientGroupActions.showClientGroupInform({
      compId: compId,
      selectedViewItem: clickedRowObject,
    });
    
    // 정책 조회
    ClientConfSettingActions.getClientConfByGroupId({
      compId: compId, groupId: id
    });   
    ClientHostNameActions.getClientHostNameByGroupId({
      compId: compId, groupId: id
    });   
    ClientUpdateServerActions.getClientUpdateServerByGroupId({
      compId: compId, groupId: id
    });   

    // get browser rule info
    BrowserRuleActions.getBrowserRuleByGroupId({
      compId: compId, groupId: id
    });
    // get media control setting info
    MediaRuleActions.getMediaRuleByGroupId({
      compId: compId, groupId: id
    });
    // get client secu info
    SecurityRuleActions.getSecurityRuleByGroupId({
      compId: compId, groupId: id
    });   

    // '데스크톱 정보설정' : 정책 정보 변경
    ClientDesktopConfigActions.getClientDesktopConfig({
      compId: compId, desktopConfId: clickedRowObject.get('desktopConfigId')
    });   
  };
  // .................................................

  // add
  handleCreateButton = () => {
    this.props.ClientGroupActions.showDialog({
      selectedViewItem: Map(),
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  // edit
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientGroupProps, this.props.match.params.grMenuId, id, 'grpId');
    ClientGroupActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(ClientGroupProps, this.props.match.params.grMenuId, id, 'grpId');
    GRConfirmActions.showConfirm({
      confirmTitle: '단말그룹 삭제',
      confirmMsg: '단말그룹(' + selectedViewItem.get('grpNm') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientGroupProps, ClientGroupActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientGroupActions.deleteClientGroupData({
        compId: compId,
        grpId: confirmObject.get('grpId')
      }).then(() => {
        ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientGroupActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientGroupProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    const listObj = ClientGroupProps.getIn(['viewItems', compId]);

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
                keyId="grpId"
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
                      onClick={event => this.handleRowClick(event, n.get('grpId'))}
                      key={n.get('grpId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('grpNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('clientCount')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('desktopConfigNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('clientConfigNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button color='secondary' size="small" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('grpId'))}>
                          <BuildIcon />
                        </Button>
                        <Button color='secondary' size="small"
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('grpId'))}>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                <TableRow >
                  <TableCell
                    colSpan={this.columnHeaders.length + 1}
                    className={classes.grSmallAndClickCell}
                  />
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
        <ClientGroupInform compId={compId} />
        <ClientGroupDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule,
  ClientConfSettingProps: state.ClientConfSettingModule,
  ClientHostNameProps: state.ClientHostNameModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule,
  ClientDesktopConfigProps: state.ClientDesktopConfigModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),

  ClientDesktopConfigActions: bindActionCreators(ClientDesktopConfigActions, dispatch),

  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupManage));


