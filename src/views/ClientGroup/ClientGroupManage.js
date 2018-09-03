import React, { Component } from 'react';
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
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';
import { getTableListObject } from 'components/GrUtils/GrTableListUtils';

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
    //this.handleSelectBtnClick();
  }

  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listObj = getTableListObject(ClientGroupProps, menuCompId);
    let orderDir = "desc";
    if (listObj.listParam.orderColumn === property && listObj.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: menuCompId
    }));
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listObj = getTableListObject(ClientGroupProps, menuCompId);

    console.log(">> handleRowClick - listObj : ", listObj);
    const selectedItem = listObj.listData.find(function(element) {
      return element.grpId == id;
    });

    ClientGroupActions.showClientGroupInform({
      compId: menuCompId,
      selectedItem: selectedItem,
    });

    
    // '단말정책설정' : 정책 정보 변경
    ClientConfSettingActions.getClientConfSetting({
      compId: menuCompId,
      objId: selectedItem.clientConfigId
    });   

    // 'Hosts설정' : 정책 정보 변경
    ClientHostNameActions.getClientHostName({
      compId: menuCompId,
      objId: selectedItem.hostNameConfigId
    });   

    // '업데이트서버설정' : 정책 정보 변경
    ClientUpdateServerActions.getClientUpdateServer({
      compId: menuCompId,
      objId: selectedItem.updateServerConfigId
    });   

    // '데스크톱 정보설정' : 정책 정보 변경
    ClientDesktopConfigActions.getClientDesktopConfig({
      compId: menuCompId,
      desktopConfId: selectedItem.desktopConfigId
    });   

  };

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const listObj = getTableListObject(ClientGroupProps, menuCompId);

    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      page: page,
      compId: menuCompId
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const listObj = getTableListObject(ClientGroupProps, menuCompId);

    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      rowsPerPage: event.target.value,
      page: 0,
      compId: menuCompId
    }));
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  // .................................................

  // add
  handleCreateButton = () => {
    this.props.ClientGroupActions.showDialog({
      selectedItem: {
        grpNm: '',
        comment: '',
        clientConfigId: '',
        isDefault: ''
      },
      dialogType: ClientGroupDialog.TYPE_ADD
    });
  }

  // edit
  handleEditClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listObj = getTableListObject(ClientGroupProps, menuCompId);
    const selectedItem = listObj.listData.find(function(element) {
      return element.grpId == id;
    });

    ClientGroupActions.showDialog({
      compId: menuCompId,
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, GrConfirmActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.setSelectedItemObj({
      compId: this.props.match.params.grMenuId,
      selectedItem: selectedItem
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말그룹 삭제',
      confirmMsg: '단말그룹(' + selectedItem.grpNm + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientGroupProps, ClientGroupActions } = this.props;
    if(confirmValue) {
      ClientGroupActions.deleteClientGroupData({
        groupId: ClientGroupProps.selectedItem.grpId
      }).then(() => {
        ClientGroupActions.readClientGroupList(ClientGroupProps.listParam);
        }, () => {
        });
    }
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const listObj = getTableListObject(ClientGroupProps, menuCompId);

    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      page: 0,
      compId: menuCompId
    }));
  };
  
  handleKeywordChange = name => event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;

    const listObj = getTableListObject(ClientGroupProps, menuCompId);
    const newParam = getMergedObject(listObj.listParam, {keyword: event.target.value});
    ClientGroupActions.changeStoreData({
      name: 'listParam', 
      value: newParam,
      compId: menuCompId
    });
  }

  // .................................................
  handleChangeGroupSelect = (event, property) => {

  };
  handleChangeClientStatusSelect = (event, property) => {

  };

  render() {
    const { classes } = this.props;
    const { ClientGroupProps } = this.props;
    const menuCompId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;
    const listObj = getTableListObject(ClientGroupProps, menuCompId);
    console.log('ClientGroupManage(render) listObj :', listObj);

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
                    value={listObj.listParam.keyword}
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
          <div>
            <Table>

              <GrCommonTableHead
                classes={classes}
                orderDir={listObj.orderDir}
                orderColumn={listObj.orderColumn}
                onRequestSort={this.handleRequestSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
              {listObj.listData.map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.grpId)}
                      key={n.grpId}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.grpNm}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.clientCount}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.desktopConfigNm}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.clientConfigNm}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.regDate, 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button color='secondary' size="small" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.grpId)}>
                          <BuildIcon />
                        </Button>
                        <Button color='secondary' size="small"
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.grpId)}>
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
          </div>

          <TablePagination
            component='div'
            count={listObj.listParam.rowsFiltered}
            rowsPerPage={listObj.listParam.rowsPerPage}
            rowsPerPageOptions={listObj.listParam.rowsPerPageOptions}
            page={listObj.listParam.page}
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
        <ClientGroupInform compId={menuCompId} />
        <ClientGroupDialog />
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


