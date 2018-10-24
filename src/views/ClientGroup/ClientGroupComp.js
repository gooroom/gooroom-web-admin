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

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import GRConfirm from 'components/GRComponents/GRConfirm';
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
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupComp extends Component {

  columnHeaders = [
    { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "단말수" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정' },
  ];

  componentDidMount() {
    if(this.props.selectorType && this.props.selectorType == 'multiple') {
      this.columnHeaders.unshift({ id: "chCheckbox", isCheckbox: true });
    }
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
  
  handleCheckAllClick = (event, checked) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientGroupProps, compId, 'grpId', checked);
    ClientGroupActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    if(this.props.onCheckAll) {
      this.props.onCheckAll(null, newCheckedIds);
    }
  };

  getClientGroupRules = (grpId) => {
    const { ClientGroupProps, compId } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;

    ClientConfSettingActions.getClientConfByGroupId({
      compId: compId, groupId: grpId
    });   
    ClientHostNameActions.getClientHostNameByGroupId({
      compId: compId, groupId: grpId
    });   
    ClientUpdateServerActions.getClientUpdateServerByGroupId({
      compId: compId, groupId: grpId
    });   

    // get browser rule info
    BrowserRuleActions.getBrowserRuleByGroupId({
      compId: compId, groupId: grpId
    });
    // get media control setting info
    MediaRuleActions.getMediaRuleByGroupId({
      compId: compId, groupId: grpId
    });
    // get client secu info
    SecurityRuleActions.getSecurityRuleByGroupId({
      compId: compId, groupId: grpId
    });   

  // '데스크톱 정보설정' : 정책 정보 변경
  // 사용자, 조직
  // ClientDesktopConfigActions.getClientDesktopConfig({
  //   compId: compId, desktopConfId: clickedRowObject.get('desktopConfigId')
  // });   

  }

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(ClientGroupProps, compId, id);

    ClientGroupActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    // this.handleRowClick(event, id);
    if(this.props.onCheck) {
      this.props.onCheck(getRowObjectById(ClientGroupProps, compId, id, 'grpId'), newCheckedIds);
    }

    if(this.props.hasShowRule) {
      this.getClientGroupRules(id);
    }
  }

  handleRowClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;

    // get Object
    const clickedRowObject = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject);
    }


    // console.log('handleRowClick :::: ', clickedRowObject);
    // console.log('this.props.selectorType :::: ', this.props.selectorType);
    // if(this.props.selectorType && this.props.selectorType == 'multiple') {
    //   const checkedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'checkedIds');
    //   console.log('checkedIds :::: ', checkedIds);
    //   if(checkedIds && this.props.onSelect) {
    //     console.log('this.props.onSelect :::: ', clickedRowObject);
    //     this.props.onSelect(clickedRowObject, checkedIds);
    //   }
    // } else {
    //   ClientGroupActions.changeCompVariable({ name: 'checkedIds', value: id, compId: compId });
    //   if(this.props.onSelect) {
    //     this.props.onSelect(clickedRowObject, List([id]));
    //   }
    // }

    if(this.props.hasShowRule) {
      this.getClientGroupRules(id);
    }
  };

  isChecked = id => {
    const { ClientGroupProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'checkedIds');
    return (checkedIds && checkedIds.includes(id));
  }

  isSelected = id => {
    const { ClientGroupProps, compId } = this.props;
    const selectedViewItem = getDataObjectVariableInComp(ClientGroupProps, compId, 'selectedViewItem');
    return (selectedViewItem && selectedViewItem.get('grpId') == id);
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientGroupActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.compId, {page: 0});
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
            <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
          </Grid>
        </Grid>

        {listObj &&
        <Table>
          {(this.props.selectorType && this.props.selectorType == 'multiple') && 
          <GRCommonTableHead
            classes={classes}
            keyId="grpId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onClickAllCheck={this.handleCheckAllClick}
            checkedIds={listObj.get('checkedIds')}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          }
          {(!this.props.selectorType || this.props.selectorType == 'single') && 
          <GRCommonTableHead
            classes={classes}
            keyId="grpId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            columnData={this.columnHeaders}
          />
          }
          <TableBody>
          {listObj.get('listData').map(n => {
            const isChecked = this.isChecked(n.get('grpId'));
            const isSelected = this.isSelected(n.get('grpId'));
            
            return (
              <TableRow
                hover
                className={(isSelected) ? classes.grSelectedRow : ''}
                onClick={event => this.handleRowClick(event, n.get('grpId'))}
                role="checkbox"
                key={n.get('grpId')}
              >
                {(this.props.selectorType && this.props.selectorType == 'multiple') && 
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isChecked} className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('grpId'))} />
                  </TableCell>
                }
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
        <GRConfirm />
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

  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupComp));


