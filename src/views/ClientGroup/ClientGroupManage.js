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

import GrPageHeader from 'containers/GrContent/GrPageHeader';

import GrPane from 'containers/GrContent/GrPane';
import GrConfirm from 'components/GrComponents/GrConfirm';

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


//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientGroupManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
    { id: "chDesktopConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "chClientConfigNm", isOrder: true, numeric: false, disablePadding: true, label: "단말정책" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  render() {
    const { classes } = this.props;
    const { orderDir, orderColumn } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientGroupManageHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
                key={column.id}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel active={orderColumn === column.id}
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
class ClientGroupManage extends Component {
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
  handleRequestSort = (event, property) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    let orderDir = "desc";
    if (ClientGroupProps.listParam.orderColumn === property && ClientGroupProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: compId
    }));
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps, ClientConfSettingProps, ClientHostNameProps, ClientUpdateServerProps, ClientDesktopConfigProps } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;

    const compId = this.props.match.params.grMenuId;

    const selectedGroupObj = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });

    ClientGroupActions.showClientGroupInform({
      compId: compId,
      selectedItem: Object.assign({}, selectedGroupObj),
    });

    ClientConfSettingActions.getClientConfSetting({
      compId: compId,
      objId: selectedGroupObj.clientConfigId
    });
    
    // '단말정책설정' : 정책 정보 변경
    ClientConfSettingActions.getClientConfSetting({
      compId: compId,
      objId: selectedGroupObj.clientConfigId
    });   

    // 'Hosts설정' : 정책 정보 변경
    ClientHostNameActions.getClientHostName({
      compId: compId,
      objId: selectedGroupObj.hostNameConfigId
    });   

    // '업데이트서버설정' : 정책 정보 변경
    ClientUpdateServerActions.getClientUpdateServer({
      compId: compId,
      objId: selectedGroupObj.updateServerConfigId
    });   

    // '데스크톱 정보설정' : 정책 정보 변경
    ClientDesktopConfigActions.getClientDesktopConfig({
      compId: compId,
      desktopConfId: selectedGroupObj.desktopConfigId
    });   

  };

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.listParam, {
      page: page,
      compId: ''
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.listParam, {
      rowsPerPage: event.target.value,
      page: 0,
      compId: ''
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
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions } = this.props;
    const selectedItem = ClientGroupProps.listData.find(function(element) {
      return element.grpId == id;
    });
    ClientGroupActions.showDialog({
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
    ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.listParam, {
      page: 0,
      compId: ''
    }));
  };
  
  handleKeywordChange = name => event => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const newParam = getMergedObject(ClientGroupProps.listParam, {
      keyword: event.target.value,
      compId: ''
    });
    ClientGroupActions.changeStoreData({name: 'listParam', value: newParam});
  }

  // .................................................
  handleChangeGroupSelect = (event, property) => {

  };
  handleChangeClientStatusSelect = (event, property) => {

  };

  render() {
    const { classes } = this.props;
    const { ClientGroupProps } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

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
                    value={ClientGroupProps.listParam.keyword}
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

              <ClientGroupManageHead
                classes={classes}
                orderDir={ClientGroupProps.listParam.orderDir}
                orderColumn={ClientGroupProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
              {ClientGroupProps.listData.map(n => {
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
                    colSpan={ClientGroupManageHead.columnData.length + 1}
                    className={classes.grSmallAndClickCell}
                  />
                </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={ClientGroupProps.listParam.rowsFiltered}
            rowsPerPage={ClientGroupProps.listParam.rowsPerPage}
            rowsPerPageOptions={ClientGroupProps.listParam.rowsPerPageOptions}
            page={ClientGroupProps.listParam.page}
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
        <ClientGroupInform
            compId={this.props.match.params.grMenuId} 
            isOpen={ClientGroupProps.informOpen} 
            selectedItem={ClientGroupProps.listParam.selectedItem}
          />
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


