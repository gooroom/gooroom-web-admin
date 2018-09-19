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

import { getRowObjectById, getDataObjectVariableInComp } from 'components/GrUtils/GrTableListUtils';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

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
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId);
  }

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId, {
      rowsPerPage: event.target.value,
      page: 0
    });
  };

  // .................................................
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupListPaged(ClientGroupProps, compId, {
      orderColumn: columnId,
      orderDir: orderDir
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const listObj = ClientGroupProps.getIn(['viewItems', compId]);
    let newSelectedIds = listObj.get('selectedIds');

    if(newSelectedIds) {
      if(checked) {
        // select all
        listObj.get('listData').map((element) => {
          if(!newSelectedIds.includes(element.get('grpId'))) {
            newSelectedIds = newSelectedIds.push(element.get('grpId'));
          }
        });
      } else {
        // deselect all
        listObj.get('listData').map((element) => {
          const index = newSelectedIds.findIndex((e) => {
            return e == element.get('grpId');
          });
          if(index > -1) {
            newSelectedIds = newSelectedIds.delete(index);
          }
        });
      }
    } else {
      if(checked) {
        newSelectedIds = listObj.get('listData').map((element) => {return element.get('grpId');});
      }
    }

    ClientGroupActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  handleRowClick = (event, id) => {
    const { ClientGroupProps, compId } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;

    const clickedRowObject = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    
    let selectedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'selectedIds');
    if(selectedIds === undefined) {
      selectedIds = List([]);
    }

    // delete if exist or add if no exist.
    const index = selectedIds.findIndex(e => e === id);
    let newSelectedIds = null;
    if(index < 0) {
      // add (push)
      newSelectedIds = selectedIds.push(id);
    } else {
      // delete
      newSelectedIds = selectedIds.delete(index);
    }
    ClientGroupActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject, newSelectedIds);
    }

    // '단말정책설정' : 정책 정보 변경
    ClientConfSettingActions.getClientConfSetting({
      compId: compId,
      objId: clickedRowObject.get('clientConfigId')
    });   

    // 'Hosts설정' : 정책 정보 변경
    ClientHostNameActions.getClientHostName({
      compId: compId,
      objId: clickedRowObject.get('hostNameConfigId')
    });   

    // '업데이트서버설정' : 정책 정보 변경
    ClientUpdateServerActions.getClientUpdateServer({
      compId: compId,
      objId: clickedRowObject.get('updateServerConfigId')
    });   

    // '데스크톱 정보설정' : 정책 정보 변경
    ClientDesktopConfigActions.getClientDesktopConfig({
      compId: compId,
      desktopConfId: clickedRowObject.get('desktopConfigId')
    });   

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

  render() {
    const { classes } = this.props;
    const { ClientGroupProps, compId } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;
    const listObj = ClientGroupProps.getIn(['viewItems', compId]);

    return (

      <div>
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
                className={classes.grNormalTableRow}
                hover
                onClick={event => this.handleRowClick(event, n.get('grpId'))}
                role="checkbox"
                aria-checked={isSelected}
                key={n.get('grpId')}
                selected={isSelected}
              >
                <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                  <Checkbox checked={isSelected} className={classes.grObjInCell} />
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.get('grpNm')}
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.get('clientCount')}
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
  ClientDesktopConfigActions: bindActionCreators(ClientDesktopConfigActions, dispatch),
  
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientGroupComp));


