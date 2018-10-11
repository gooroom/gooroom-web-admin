import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import AdminUserDialog from './AdminUserDialog';
import AdminRecordDialog from './AdminRecordDialog';

import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class ServerUrlInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        gpmsInfo: '',
        glmInfo: '',
        grmInfo: ''
      })
    };
  }

  componentDidMount() {


  }

  // .................................................
  handleChangePage = (event, page) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { AdminUserActions, AdminUserProps } = this.props;
    AdminUserActions.readAdminUserListPaged(AdminUserProps, this.props.match.params.grMenuId);
  };
  
  handleRowClick = (event, id) => {
    const { AdminUserProps, AdminUserActions } = this.props;
    const selectedViewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    AdminUserActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: AdminUserDialog.TYPE_VIEW
    });
  };

  // show admin records
  handleShowRecord = (event, id) => {
    event.stopPropagation();
    this.setState({
      openRecordDialog: true,
      recordAdminId: id
    });
  };
  
  handleCloseRecord = (event, id) => {
    this.setState({
      openRecordDialog: false,
      recordAdminId: ''
    });
  };
      
  // create dialog
  handleCreateButton = () => {
    this.props.AdminUserActions.showDialog({
      selectedViewItem: {
        adminId: ''
      },
      dialogType: AdminUserDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { AdminUserProps, AdminUserActions } = this.props;
    const selectedViewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    AdminUserActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: AdminUserDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { AdminUserProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(AdminUserProps, this.props.match.params.grMenuId, id, 'adminId');
    GrConfirmActions.showConfirm({
      confirmTitle: '관리자계정 삭제',
      confirmMsg: '관리자계정(' + selectedViewItem.get('adminId') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { AdminUserProps, AdminUserActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      AdminUserActions.deleteAdminUserData({
        compId: compId,
        adminId: confirmObject.get('adminId')
      }).then(() => {
        AdminUserActions.readAdminUserListPaged(AdminUserProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.AdminUserActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;

    return (
          <form className={classes.container} noValidate autoComplete="off">

            <TextField
              id="outlined-full-width"
              label="Label"
              style={{ margin: 8 }}
              placeholder="Placeholder"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          
          </form>
    );
  }
}

export default withStyles(GrCommonStyle)(ServerUrlInfo);
