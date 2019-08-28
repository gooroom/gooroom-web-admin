import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "moment";

import * as UserActions from 'modules/UserModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import UserBasicDialog from "views/User/UserBasicDialog";
import UserDialog from "views/User/UserDialog";
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserListComp extends Component {
  
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

  handleSelectBtnClick = () => {
    const { UserActions, UserProps, compId } = this.props;
    UserActions.readUserListPaged(UserProps, compId, {page: 0});
  };

  // edit
  handleEditClick = (event, id) => { 
    const { UserProps, UserActions, compId } = this.props;
    let viewItem = getRowObjectById(UserProps, compId, id, 'userId');

    // expireDate 와 passwordExpireDate 를 초기값 설정
    if(viewItem.get('isUseExpire') === '0' || viewItem.get('expireDate') === undefined || viewItem.get('expireDate') === '') {
      const initDate = moment().add(7, "days");
      viewItem = viewItem.set('expireDate', initDate.toJSON().slice(0, 10));
    }
    if(viewItem.get('isUsePasswordExpire') === '0' || viewItem.get('passwordExpireDate') === undefined || viewItem.get('passwordExpireDate') === '') {
      const initDate = moment().add(7, "days");
      viewItem = viewItem.set('passwordExpireDate', initDate.toJSON().slice(0, 10));
    }

    UserActions.showDialog({
      viewItem: viewItem,
      dialogType: UserBasicDialog.TYPE_EDIT
    }, false);
  };

  // delete
  handleDeleteClick = (event, id) => {
    this.props.onDeleteHandle(id);
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

  isUserChecked = () => {
    const { UserProps, compId } = this.props;
    const checkedIds = UserProps.getIn(['viewItems', compId, 'checkedIds']);
    return (checkedIds && checkedIds.size > 0) ? false : true;
  }

  handleCreateUserButton = value => {
    const { UserActions } = this.props;
    UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: '',
        userNm: '',
        userPasswd: '',
        showPasswd: false
      },
      ruleDialogType: UserDialog.TYPE_ADD
    }, true);
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.UserActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleChangeUserStatusSelect = (value) => {
    const { UserActions, UserProps, compId } = this.props;
    UserActions.readUserListPaged(UserProps, compId, { page: 0, status: (value == 'ALL') ? '' : value });
  }

  render() {

    const { classes } = this.props;
    const { UserProps, compId, isEnableEdit } = this.props;
    const { t, i18n } = this.props;

    let columnHeaders = [
      { id: "chCheckbox", isCheckbox: true},
      { id: "chUserId", isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: "chUserNm", isOrder: true, numeric: false, disablePadding: true, label: t("colUserNm") },
      { id: "chDeptNm", isOrder: true, numeric: false, disablePadding: true, label: t("colDeptNm") },
      { id: "chStatus", isOrder: false, numeric: false, disablePadding: true, label: t("colStatus") },
      { id: "chLastLoginDt", isOrder: true, numeric: false, disablePadding: true, label: t("colLoginDate") },
      { id: "chLastClientId", isOrder: true, numeric: false, disablePadding: true, label: t("colLoginClient") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];
    if(!isEnableEdit) {
      columnHeaders.pop();
    }

    const listObj = UserProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
      {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="flex-start" >
          <Grid item xs={3} >
            <FormControl fullWidth={true}>
              <UserStatusSelect onChangeSelect={this.handleChangeUserStatusSelect} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
          <Grid item xs={4} style={{textAlign:'right'}}>
            {/**
            <Tooltip title={t("ttMoveDept")}>
              <span>
              <Button className={classes.GRIconSmallButton} variant="outlined" color="primary" onClick={this.props.onMoveUserToDept} disabled={this.isUserChecked()} >
                <MoveIcon /><DeptIcon />
              </Button>
              </span>
            </Tooltip>
            <Tooltip title={t("ttAddUser")}>
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={this.handleCreateUserButton} style={{marginLeft: "4px"}}>
                <AddIcon /><AccountIcon />
              </Button>
            </Tooltip>
             */}
          </Grid>
        </Grid>

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
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData') && listObj.get('listData').map(n => {
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
                  <TableCell className={classes.grSmallAndClickCell}
                    style={(n.get('isExpired') === '1') ? {color:'red'} : {color:''}}
                  
                  >{n.get('userId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCellAndBreak}>{n.get('userNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCellAndBreak}>{n.get('deptNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('status')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('lastLoginDt'), 'YY/MM/DD HH:mm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>
                    {(n.get('statusCd') !== 'STAT020' && isEnableEdit) &&
                      <React.Fragment>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleEditClick(event, n.get('userId'))}>
                      <EditIcon />
                    </Button>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleDeleteClick(event, n.get('userId'))}>
                      <DeleteIcon />
                    </Button>
                      </React.Fragment>
                    }
                  </TableCell>
                </TableRow>
              );
            })}

            {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
              <TableRow key={e}>
                <TableCell
                  colSpan={columnHeaders.length + 1}
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
      </React.Fragment>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserListComp)));

