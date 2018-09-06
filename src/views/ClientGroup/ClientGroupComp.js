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

import { getMergedObject, arrayContainsArray, getListData } from 'components/GrUtils/GrCommonUtils';
import { getTableListObject, getTableSelectedObject, getDataListAndParamInComp, getTableObjectById } from 'components/GrUtils/GrTableListUtils';

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
    const { ClientGroupActions, ClientGroupProps } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    ClientGroupActions.readClientGroupList(ClientGroupProps, compId, {
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
    ClientGroupActions.readClientGroupList(ClientGroupProps, compId, {
      orderColumn: columnId,
      orderDir: orderDir
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const listObj = getTableListObject(ClientGroupProps, compId);

    if(checked) {
      const newSelected = listObj.listData.map(n => n.grpId)
      ClientGroupActions.changeStoreData({
        name: compId + '__selected',
        value: newSelected
      });
      this.props.onChangeGroupSelected(compId, newSelected);
    } else {
      ClientGroupActions.changeStoreData({
        name: compId + '__selected',
        value: []
      });
      this.props.onChangeGroupSelected(compId, []);
    }
  };

  handleRowClick = (event, id) => {

    const { compId, ClientGroupProps } = this.props;
    const { ClientGroupActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;

    const preSelected = getTableSelectedObject(ClientGroupProps, compId);
    let newSelected = [];
    if(preSelected) {
      const selectedIndex = preSelected.indexOf(id);  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(preSelected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(preSelected.slice(1));
      } else if (selectedIndex === preSelected.length - 1) {
        newSelected = newSelected.concat(preSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          preSelected.slice(0, selectedIndex),
          preSelected.slice(selectedIndex + 1)
        );
      }
    } else {
      newSelected = [id];
    }

    ClientGroupActions.changeStoreData({
      name: 'listParam',
      value: newSelected,
      compId: compId
    });

    const listData = getListData({ props: ClientGroupProps, compId: compId });
    const selectedItem = listData.find(function(element) {
      return element.grpId == id;
    });

    if(this.props.onChangeGroupSelected) {
      this.props.onChangeGroupSelected(selectedItem, newSelected);
    }

    // // '단말정책설정' : 정책 정보 변경
    // ClientConfSettingActions.getClientConfSetting({
    //   compId: compId,
    //   objId: selectedItem.clientConfigId
    // });   

    // // 'Hosts설정' : 정책 정보 변경
    // ClientHostNameActions.getClientHostName({
    //   compId: compId,
    //   objId: selectedItem.hostNameConfigId
    // });   

    // // '업데이트서버설정' : 정책 정보 변경
    // ClientUpdateServerActions.getClientUpdateServer({
    //   compId: compId,
    //   objId: selectedItem.updateServerConfigId
    // });   

    // // '데스크톱 정보설정' : 정책 정보 변경
    // ClientDesktopConfigActions.getClientDesktopConfig({
    //   compId: compId,
    //   desktopConfId: selectedItem.desktopConfigId
    // });   

  };

  //isSelected = id => this.state.selected.indexOf(id) !== -1;
  isSelected = id => {
    const { ClientGroupProps, compId } = this.props;
    const selectedObj = getTableSelectedObject(ClientGroupProps, compId);

    console.log('selectedObj >>> ', selectedObj);

    // if(selectedObj) {
    //   return selectedObj.indexOf(id) !== -1;
    // } else {
      return false;
    // }    
  }

  render() {
    const { classes } = this.props;
    const { ClientGroupProps, compId } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;
    const listObj = getTableListObject(ClientGroupProps, compId);

    return (

      <div>
        <Table>
          <GrCommonTableHead
            classes={classes}
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onSelectAllClick={this.handleSelectAllClick}
            //selectedData={selectedObj}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.get('listData').map(n => {
            const isSelected = this.isSelected(n.grpId);
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
        {listObj.get('listData') && listObj.get('listData').size > 0 &&
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


