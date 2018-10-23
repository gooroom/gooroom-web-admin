import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComp, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import SecurityRuleDialog from './SecurityRuleDialog';
import SecurityRuleSpec from './SecurityRuleSpec';
import { generateSecurityRuleObject } from './SecurityRuleSpec';
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

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class SecurityRuleManage extends Component {

  columnHeaders = [
    { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: '구분' },
    { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: '정책이름' },
    { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: '정책아이디' },
    { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: '수정자' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    SecurityRuleActions.readSecurityRuleListPaged(SecurityRuleProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    SecurityRuleActions.readSecurityRuleListPaged(SecurityRuleProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    SecurityRuleActions.readSecurityRuleListPaged(SecurityRuleProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    SecurityRuleActions.readSecurityRuleListPaged(SecurityRuleProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.SecurityRuleActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }
    
  handleRowClick = (event, id) => {
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const selectedViewItem = getRowObjectById(SecurityRuleProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // SecurityRuleActions.showDialog({
    //   selectedViewItem: viewObject,
    //   dialogType: SecurityRuleDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    SecurityRuleActions.showInform({
      compId: compId,
      selectedViewItem: selectedViewItem
    });
    
  };

  handleCreateButton = () => {
    this.props.SecurityRuleActions.showDialog({
      selectedViewItem: Map({
        objNm: 'testAuto',
        comment: 'testcomment',
        screenTime: '11',
        passwordTime: '22',
        packageHandle: 'allow'
      }),
      dialogType: SecurityRuleDialog.TYPE_ADD
    });
  }

  handleEditListClick = (event, id) => { 
    const { SecurityRuleActions, SecurityRuleProps } = this.props;
    const selectedViewItem = getRowObjectById(SecurityRuleProps, this.props.match.params.grMenuId, id, 'objId');

    SecurityRuleActions.showDialog({
      selectedViewItem: generateSecurityRuleObject(selectedViewItem),
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { SecurityRuleProps, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(SecurityRuleProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: '단말보안정책정보 삭제',
      confirmMsg: '단말보안정책정보(' + selectedViewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {

    if(confirmValue) {
      const { SecurityRuleProps, SecurityRuleActions } = this.props;

      SecurityRuleActions.deleteSecurityRule({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComp(SecurityRuleProps, SecurityRuleActions.readSecurityRuleListPaged);
      });
    }
  };

  // ===================================================================
  handleCopyClick = (selectedViewItem) => {
    const { SecurityRuleActions } = this.props;
    SecurityRuleActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: SecurityRuleDialog.TYPE_COPY
    });
  };

  handleEditItemClick = (viewItem, compType) => {
    this.props.SecurityRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================


  render() {
    const { classes } = this.props;
    const { SecurityRuleProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;//SecurityRuleProps.listParam.rowsPerPage - SecurityRuleProps.listData.length;

    const selectedItem = SecurityRuleProps.getIn(['viewItems', compId]);
    
    return (
      <div>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6}>
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>

            </Grid>

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>            

          {/* data area */}
          {(selectedItem) &&
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="objId"
                orderDir={selectedItem.getIn(['listParam', 'orderDir'])}
                orderColumn={selectedItem.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {selectedItem.get('listData').map(n => {
                  return (
                    <TableRow 
                      hover
                      onClick={event => this.handleRowClick(event, n.get('objId'))}
                      tabIndex={-1}
                      key={n.get('objId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId').endsWith('DEFAULT') ? '기본' : '일반'}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditListClick(event, n.get('objId'))}>
                          <BuildIcon />
                        </Button>

                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
                          <DeleteIcon />
                        </Button>                        

                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell colSpan={this.columnHeaders.columnData.length + 1} className={classes.grSmallAndClickCell} />
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component='div'
              count={selectedItem.getIn(['listParam', 'rowsFiltered'])}
              rowsPerPage={selectedItem.getIn(['listParam', 'rowsPerPage'])}
              rowsPerPageOptions={selectedItem.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
              page={selectedItem.getIn(['listParam', 'page'])}
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
        {/* dialog(popup) component area */}
        <SecurityRuleSpec 
          specType="inform" 
          selectedItem={selectedItem}
          handleCopyClick={this.handleCopyClick}
          handleEditClick={this.handleEditItemClick}
        />
        <SecurityRuleDialog compId={compId} />
        <GRConfirm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleManage));



