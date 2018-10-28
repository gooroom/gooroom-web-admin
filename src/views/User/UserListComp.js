import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserActions from 'modules/UserModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GRPageHeader from "containers/GRContent/GRPageHeader";
import GRConfirm from 'components/GRComponents/GRConfirm';

import UserBasicDialog from "views/User/UserBasicDialog";
import GRPane from "containers/GRContent/GRPane";
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserListComp extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: "아이디" },
    { id: "chUserNm", isOrder: true, numeric: false, disablePadding: true, label: "사용자이름" },
    { id: "chStatus", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: "chDeptNm", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  componentDidMount() {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.compId, {page: page});
  };

  handleChangeRowsPerPage = event => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.UserActions.readUserListPaged(this.props.UserProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };
  // .................................................

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { UserProps, UserActions, compId } = this.props;

    const selectRowObject = getRowObjectById(UserProps, compId, id, 'userId');
    // const newCheckedIds = setCheckedIdsInComp(UserProps, compId, id);

    // check select box
    // UserActions.changeCompVariable({
    //   name: 'checkedIds',
    //   value: newCheckedIds,
    //   compId: compId
    // });

    if(this.props.onSelect) {
      this.props.onSelect(selectRowObject);
    }
  };

  // edit
  handleEditClick = (event, id) => { 
    const { UserProps, UserActions, compId } = this.props;
    const viewItem = getRowObjectById(UserProps, compId, id, 'userId');
    UserActions.showDialog({
      viewItem: viewItem,
      dialogType: UserBasicDialog.TYPE_EDIT
    }, false);
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { UserProps, GRConfirmActions, compId } = this.props;
    const viewItem = getRowObjectById(UserProps, compId, id, 'userId');
    GRConfirmActions.showConfirm({
      confirmTitle: '사용자정보 삭제',
      confirmMsg: '사용자정보(' + viewItem.get('userNm') + ')을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { UserProps, UserActions, compId } = this.props;
      UserActions.deleteUserData({
        compId: compId,
        userId: confirmObject.get('userId')
      }).then(() => {
        UserActions.readUserListPaged(UserProps, compId);
      });
    }
  };


  handleClickAllCheck = (event, checked) => {
    const { UserActions, UserProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(UserProps, compId, 'userId', checked);

    UserActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { UserActions, UserProps, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(UserProps, compId, id);  

    UserActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

  }

  isChecked = id => {
    const { UserProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(UserProps, compId, 'checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { UserProps, compId } = this.props;
    const selectId = getDataObjectVariableInComp(UserProps, compId, 'selectId');
    return (selectId == id);
  }

  render() {

    const { classes } = this.props;
    const { UserProps, compId } = this.props;
    
    const listObj = UserProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="userId"
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
              const isChecked = this.isChecked(n.get('userId'));
              const isSelected = this.isSelected(n.get('userId'));

              return (
                <TableRow
                  hover
                  className={(isSelected) ? classes.grSelectedRow : ''}
                  onClick={event => this.handleSelectRow(event, n.get('userId'))}
                  role="checkbox"
                  key={n.get('userId')}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('userId'))}/>
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('status')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleEditClick(event, n.get('userId'))}>
                      <SettingsApplicationsIcon />
                    </Button>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleDeleteClick(event, n.get('userId'))}>
                      <DeleteIcon />
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
      <UserBasicDialog compId={compId} />
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserListComp));

