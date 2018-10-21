import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import MUIDataTable from "mui-datatables";

import CustomToolbar from "./CustomToolbar";
import CustomToolbarSelect from "./CustomToolbarSelect";

import { refreshDataListInComp, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import SecurityRuleDialog from './SecurityRuleDialog';
import SecurityRuleSpec from './SecurityRuleSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import Checkbox from "@material-ui/core/Checkbox";
import Input from '@material-ui/core/Input';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class SecurityRuleNetwork extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'chDirection', isOrder: false, numeric: false, disablePadding: true, label: 'DIRECTION' },
    { id: 'chConfName', isOrder: false, numeric: false, disablePadding: true, label: '내용' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      nwColumns: ["Name", "Company", "City", "State"],
      nwData: [
        ["1Joe James", "Test Corp", "Yonkers", "NY"],
        ["2John Walsh", "Test Corp", "Hartford", "CT"],
        ["3Bob Herm", "Test Corp", "Tampa", "FL"],
        ["4John Walsh", "Test Corp", "Hartford", "CT"],
        ["5Bob Herm", "Test Corp", "Tampa", "FL"],
      ],
      nwOptions: {
        filterType: 'checkbox',
        onChangePage: this.onChangePage,
        customToolbar: () => <CustomToolbar editingItem={props.editingItem} handleAddClick={this.handleAddClick} />,
        customToolbarSelect: (selectedRows) => <CustomToolbarSelect selectedRows={selectedRows} />,
  
        responsive: 'scroll',
        rowsPerPage: 100,
  
        pagination: false,
        sort: false,
        filter: false,
        search: false,
        print: false,
        download: false,
        viewColumns: false
      }
  
     
    }
  }

  componentDidMount() {
    // this.handleCreateButton();//.handleSelectBtnClick();
  }

  handleKeywordChange = (name, value) => {
    // this.props.SecurityRuleActions.changeListParamData({
    //   name: name, 
    //   value: value,
    //   compId: this.props.match.params.grMenuId
    // });
  }

  handleCreateButton = () => {
    // this.props.SecurityRuleActions.showDialog({
    //   selectedViewItem: Map(),
    //   dialogType: SecurityRuleDialog.TYPE_ADD
    // });
  }

  handleEditClick = (event, id) => { 
    // const { SecurityRuleActions, SecurityRuleProps } = this.props;
    // const selectedViewItem = getRowObjectById(SecurityRuleProps, this.props.match.params.grMenuId, id, 'objId');
    // SecurityRuleActions.showDialog({
    //   selectedViewItem: SecurityRuleSpec.generateSecurityRuleObject(selectedViewItem),
    //   dialogType: SecurityRuleDialog.TYPE_EDIT
    // });
  };

  // delete
  handleDeleteClick = (event, id) => {
    // const { SecurityRuleProps, GRConfirmActions } = this.props;
    // const selectedViewItem = getRowObjectById(SecurityRuleProps, this.props.match.params.grMenuId, id, 'objId');
    // GRConfirmActions.showConfirm({
    //   confirmTitle: '단말보안정책정보 삭제',
    //   confirmMsg: '단말보안정책정보(' + selectedViewItem.get('objId') + ')를 삭제하시겠습니까?',
    //   handleConfirmResult: this.handleDeleteConfirmResult,
    //   confirmObject: selectedViewItem
    // });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    // if(confirmValue) {
    //   const { SecurityRuleProps, SecurityRuleActions } = this.props;
    //   SecurityRuleActions.deleteSecurityRule({
    //     objId: paramObject.get('objId'),
    //     compId: this.props.match.params.grMenuId
    //   }).then((res) => {
    //     refreshDataListInComp(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
    //   });
    // }
  };

  handleAddClick = () => {
    console.log('handleAddClick ................. ');

    let nwData = this.state.nwData;
    nwData.push(["2", "", "", ""]);

    console.log('nwData ................. ', nwData);
    this.setState({
      nwData: nwData
    });
  }

  isSelected = id => {
    // const { ClientManageProps } = this.props;
    // const selectedIds = getDataObjectVariableInComp(ClientManageProps, this.props.match.params.grMenuId, 'selectedIds');

    // if(selectedIds) {nwOptions
    //   return selectednwOptionsid);
    // } else {
      return false;
//    }    
  };

  onChangePage = (number) => {
    console.log('number >>>>>>>  ', number);
  }

  customToolbar = () => {
    return <CustomToolbar />;
  }

  render() {
    const { classes } = this.props;
    const { editingItem } = this.props;
   
    return (
      <div>
        <MUIDataTable
          title={"방화벽 설정"}
          data={this.state.nwData}
          columns={this.state.nwColumns}
          options={this.state.nwOptions}
          
        />
      </div>
    );
  }
}

export default withStyles(GRCommonStyle)(SecurityRuleNetwork);
