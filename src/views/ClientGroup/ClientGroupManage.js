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
import * as ClientDesktopConfigActions from 'modules/ClientDesktopConfigModule';

import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp, getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrPane from 'containers/GrContent/GrPane';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

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
import { GrCommonStyle } from 'templates/styles/GrStyles';


class ClientGroupManage extends Component {

  columnHeaders = [
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
    { id: "chDesktopConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "chClientConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "단말정책" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value,
      page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(ClientGroupProps, this.props.match.params.grMenuId, {
      orderColumn: columnId,
      orderDir: orderDir
    });
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;

    const menuCompId = this.props.match.params.grMenuId;
    const selectedItem = getRowObjectById(ClientGroupProps, menuCompId, id, 'grpId');

    ClientGroupActions.showClientGroupInform({
      compId: menuCompId,
      selectedItem: selectedItem,
    });
    
    // '단말정책설정' : 정책 정보 변경
    ClientConfSettingActions.getClientConfSetting({
      compId: menuCompId,
      objId: selectedItem.get('clientConfigId')
    });   

    // 'Hosts설정' : 정책 정보 변경
    ClientHostNameActions.getClientHostName({
      compId: menuCompId,
      objId: selectedItem.get('hostNameConfigId')
    });   

    // '업데이트서버설정' : 정책 정보 변경
    ClientUpdateServerActions.getClientUpdateServer({
      compId: menuCompId,
      objId: selectedItem.get('updateServerConfigId')
    });   

    // '데스크톱 정보설정' : 정책 정보 변경
    ClientDesktopConfigActions.getClientDesktopConfig({
      compId: menuCompId,
      desktopConfId: selectedItem.get('desktopConfigId')
    });   
  };
  // .................................................

  // add
  handleCreateButton = () => {
    this.props.ClientGroupActions.showDialog({
      selectedItem: Map(),
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  // edit
  handleEditClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedItem = getRowObjectById(ClientGroupProps, this.props.match.params.grMenuId, id, 'grpId');
    ClientGroupActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions, GrConfirmActions } = this.props;
    const selectedItem = getRowObjectById(ClientGroupProps, this.props.match.params.grMenuId, id, 'grpId');
    GrConfirmActions.showConfirm({
      confirmTitle: '단말그룹 삭제',
      confirmMsg: '단말그룹(' + selectedItem.get('grpNm') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientGroupProps, ClientGroupActions } = this.props;
      const menuCompId = this.props.match.params.grMenuId;
      ClientGroupActions.deleteClientGroupData({
        groupId: confirmObject.get('grpId')
      }).then(() => {
        ClientGroupActions.readClientGroupList(ClientGroupProps, menuCompId);
      });
    }
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = name => event => {
    this.props.ClientGroupActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;
    const listObj = getDataObjectInComp(ClientGroupProps, menuCompId);

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6} >
                <FormControl fullWidth={true}>
                  <TextField
                    id='keyword'
                    label='검색어'
                    onChange={this.handleKeywordChange('keyword')}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6} >
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

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end">
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
          {(listObj) && 
            <div>
            <Table>
              <GrCommonTableHead
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
                      className={classes.grNormalTableRow}
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

        </GrPane>
        <ClientGroupInform compId={menuCompId} />
        <ClientGroupDialog compId={menuCompId} />
        <GrConfirm />
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
  ClientDesktopConfigActions: bindActionCreators(ClientDesktopConfigActions, dispatch),

  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupManage));


