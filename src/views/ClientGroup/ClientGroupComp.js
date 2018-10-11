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

import * as GrConfirmActions from 'modules/GrConfirmModule';

import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import GrConfirm from 'components/GrComponents/GrConfirm';
import ClientGroupDialog from './ClientGroupDialog';

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
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import BuildIcon from '@material-ui/icons/Build';
import Search from '@material-ui/icons/Search'; 

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupComp extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정' },
  ];

  componentDidMount() {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // edit
  handleEditClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const selectedViewItem = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    ClientGroupActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const newSelectedIds = setAllSelectedIdsInComp(ClientGroupProps, compId, 'grpId', checked);
    ClientGroupActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  handleSelectGroup = (event, id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const newSelectedIds = setSelectedIdsInComp(ClientGroupProps, compId, id);

    ClientGroupActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    this.handleRowClick(event, id);
  }

  handleRowClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, compId } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;

    const clickedRowObject = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    const newSelectedIds = setSelectedIdsInComp(ClientGroupProps, compId, id);

    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject, newSelectedIds);
    }

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

    // show rules
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
    // 이것은 사용자, 조직 위주
    // ClientDesktopConfigActions.getClientDesktopConfig({
    //   compId: compId, desktopConfId: clickedRowObject.get('desktopConfigId')
    // });   

  };

  isSelected = id => {
    const { ClientGroupProps, compId } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientGroupActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.match.params.grMenuId);
  };

  render() {
    const { classes } = this.props;
    const { ClientGroupProps, compId } = this.props;

    const listObj = ClientGroupProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={6} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={6} >
            <Button size="small" variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
          </Grid>
        </Grid>

        {listObj &&
        <Table>
          <GrCommonTableHead
            classes={classes}
            keyId="grpId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onSelectAllClick={this.handleSelectAllClick}
            selectedIds={listObj.get('selectedIds')}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.get('listData').map(n => {
            const isSelected = this.isSelected(n.get('grpId'));
            return (
              <TableRow
                hover
                onClick={event => this.handleRowClick(event, n.get('grpId'))}
                role="checkbox"
                aria-checked={isSelected}
                key={n.get('grpId')}
                selected={isSelected}
              >
                <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                  <Checkbox checked={isSelected} className={classes.grObjInCell} onClick={event => this.handleSelectGroup(event, n.get('grpId'))} />
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.get('grpNm')}
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.get('clientCount')}
                </TableCell>

                <TableCell className={classes.grSmallAndClickCell}>
                  <Button color='secondary' size="small" 
                    className={classes.buttonInTableRow} 
                    onClick={event => this.handleEditClick(event, n.get('grpId'))}>
                    <BuildIcon />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}

          {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
            <TableRow key={e}>
              <TableCell
                colSpan={this.columnHeaders.length + 1}
                className={classes.grSmallAndClickCell}
              />
            </TableRow>
          )}))}
          </TableBody>
        </Table>
        }
        {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
          <TablePagination
            component='div'
            count={listObj.getIn(['listParam', 'rowsFiltered'])}
            rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
            rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
            page={listObj.getIn(['listParam', 'page'])}
            labelDisplayedRows={() => {return ''}}
            labelRowsPerPage=""
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        }
        <ClientGroupDialog compId={compId} />
        <GrConfirm />
      </div>
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

  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupComp));


