import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRPane from 'containers/GRContent/GRPane';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import BrowserRuleDialog from "views/Rules/UserConfig/BrowserRuleDialog";
import SecurityRuleDialog from "views/Rules/UserConfig/SecurityRuleDialog";
import MediaRuleDialog from "views/Rules/UserConfig/MediaRuleDialog";

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
import DescIcon from '@material-ui/icons/Description';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";

import ClientManageInform from "./ClientManageInform";
// option components
import ClientGroupSelect from 'views/Options/ClientGroupSelect';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManage extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'clientId', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'loginId', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    { id: 'clientGroupName', isOrder: true, numeric: false,disablePadding: true,label: '단말그룹'},
    { id: 'lastLoginDate', isOrder: true, numeric: false, disablePadding: true, label: '최종접속일' },
    { id: 'clientIp', isOrder: true, numeric: false, disablePadding: true, label: '최종접속IP' },
    { id: 'strgSize', isOrder: true, numeric: false, disablePadding: true, label: '용량' },
    { id: 'totalCnt', isOrder: true, numeric: false, disablePadding: true, label: '패키지수' }
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
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page:0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const clickedRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');
    const newCheckedIds = setCheckedIdsInComp(ClientManageProps, compId, id);

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    ClientManageActions.showClientManageInform({
      compId: compId,
      selectedViewItem: clickedRowObject,
    });
  };

  handleSelectBtnClick = () => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  };

  handleChangeGroupSelect = (event, property) => {
    this.props.ClientManageActions.changeListParamData({
      name: 'groupId', 
      value: property,
      compId: this.props.match.params.grMenuId
    });
  };

  handleChangeClientStatusSelect = (event, property) => {
    this.props.ClientManageActions.changeListParamData({
      name: 'clientType', 
      value: property,
      compId: this.props.match.params.grMenuId
    });
  };

  isChecked = id => {
    const { ClientManageProps } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientManageProps, this.props.match.params.grMenuId, 'checkedIds');
    return (checkedIds && checkedIds.includes(id));
  };


  handleCreateButton = () => {
    //console.log('handleCreateButton...............');
  };


  handleClickAllCheck = (event, checked) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const newCheckedIds = getDataPropertyInCompByParam(ClientManageProps, compId, 'clientId', checked);

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };


  render() {
    const { classes } = this.props;
    const { ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;
    const listObj = ClientManageProps.getIn(['viewItems', compId]);

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="client-status">단말상태</InputLabel>
                  <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="client-status">단말그룹</InputLabel>
                  <ClientGroupSelect onChangeSelect={this.handleChangeGroupSelect} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>

            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
            {/*
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />등록
              </Button>
            */}
            </Grid>
          </Grid>
          {/* data area */}
          {(listObj) && 
            <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="clientId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onClickAllCheck={this.handleClickAllCheck}
                checkedIds={listObj.get('checkedIds')}
                listData={listObj.get('listData')}
                columnData={this.columnHeaders}
              />
              <TableBody>
              {listObj.get('listData').map(n => {
                  const isChecked = this.isChecked(n.get('clientId'));
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleRowClick(event, n.get('clientId'))}
                      role="checkbox"
                      aria-checked={isChecked}
                      key={n.get('clientId')}
                      selected={isChecked}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                        <Checkbox checked={isChecked} className={classes.grObjInCell} />
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('viewStatus')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('loginId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientGroupName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('lastLoginTime'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientIp')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('strgSize')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('totalCnt')}</TableCell>
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
            labelDisplayedRows={() => {return ''}}
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
        <ClientManageInform compId={compId} />

        <BrowserRuleDialog compId={compId} />
        <SecurityRuleDialog compId={compId} />
        <MediaRuleDialog compId={compId} />

      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule,
  CommonOptionProps: state.CommonOptionModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientManage));

