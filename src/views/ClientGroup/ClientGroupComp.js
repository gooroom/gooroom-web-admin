import React, { Component } from 'react';
import { merge } from 'immutable';
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
import { getTableListObject, getTableSelectedObject } from 'components/GrUtils/GrTableListUtils';
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

    // ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.defaultListParam, {
    //   page:0,
    //   compId: this.props.compId
    // }));

    let listParam = ClientGroupProps.get('defaultListParam').toJS();
    Object.assign(listParam, {
      page:0,
      compId: this.props.compId
    });

    console.log('listParam : ', listParam);
    ClientGroupActions.readClientGroupList(listParam);
  }

  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const listObj = getTableListObject(ClientGroupProps, compId);

    let orderDir = "desc";
    if (listObj.orderColumn === property && listObj.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: this.props.compId
    }));
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

  handleChangePage = (event, page) => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const listObj = getTableListObject(ClientGroupProps, compId);

    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      page: page, 
      compId: this.props.compId
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const listObj = getTableListObject(ClientGroupProps, compId);

    ClientGroupActions.readClientGroupList(getMergedObject(listObj.listParam, {
      rowsPerPage: event.target.value,
      page:0,
      compId: this.props.compId
    }));
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

  // loadInitData = (param) => {
  //   const { ClientGroupActions, ClientGroupProps } = this.props;
  //   ClientGroupActions.readClientGroupList(getMergedObject(ClientGroupProps.listParam, param));
  // };

  // .................................................

  render() {
    const { classes } = this.props;
    const { ClientGroupProps, compId } = this.props;
    const emptyRows = 0;// = ClientGroupProps.listParam.rowsPerPage - ClientGroupProps.listData.length;

    console.log('ClientGroupProps >>> ', ClientGroupProps);
    console.log('ClientGroupProps.toJS() >>> ', ClientGroupProps.toJS());
    console.log('ClientGroupProps.get(viewItems) >>> ', ClientGroupProps.get('viewItems'));

    const listObj = (ClientGroupProps.get('viewItems')) ? getTableListObject(ClientGroupProps.get('viewItems'), compId) : ClientGroupProps.get('defaultListParam');
    console.log('================================', listObj);
    console.log('#############################################');
    
    //const selectedObj = getTableSelectedObject(ClientGroupProps, compId);

    // const { 
    //   [compId + '__listData'] : compListData, 
    //   [compId + '__listParam'] : compListParam, 
    //   [compId + '__selected'] : compSelected
    // } = ClientGroupProps;

    return (

      <div>
        <Table>
          <GrCommonTableHead
            classes={classes}
            orderDir={listObj.get('orderDir')}
            orderColumn={listObj.get('orderColumn')}
            onRequestSort={this.handleRequestSort}
            onSelectAllClick={this.handleSelectAllClick}
            //selectedData={selectedObj}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.listData && listObj.listData.map(n => {
            const isSelected = this.isSelected(n.grpId);
            return (
              <TableRow
                className={classes.grNormalTableRow}
                hover
                onClick={event => this.handleRowClick(event, n.grpId)}
                role="checkbox"
                aria-checked={isSelected}
                key={n.grpId}
                selected={isSelected}
              >
                <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                  <Checkbox checked={isSelected} className={classes.grObjInCell} />
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.grpNm}
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>
                  {n.clientCount}
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
        {listObj.listParam &&
          <TablePagination
            component='div'
            count={listObj.listParam.rowsFiltered}
            rowsPerPage={listObj.listParam.rowsPerPage}
            rowsPerPageOptions={[]}
            labelDisplayedRows={() => {return ''}}
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


