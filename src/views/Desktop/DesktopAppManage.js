import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComp, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import DesktopAppDialog from './DesktopAppDialog';
import DesktopAppSpec from './DesktopAppSpec';

import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

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
class DesktopAppManage extends Component {

  columnHeaders = [
    { id: 'chAppId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chAppNm', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chAppInfo', isOrder: false, numeric: false, disablePadding: true, label: '설명' },
    { id: 'chStatus', isOrder: false, numeric: false, disablePadding: true, label: '상태' },
    { id: 'chModUser', isOrder: false, numeric: false, disablePadding: true, label: '수정자' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    DesktopAppActions.readDesktopAppListPaged(DesktopAppProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.DesktopAppActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }
  
  handleSelectRow = (event, id) => {
    const { DesktopAppActions, DesktopAppProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(DesktopAppProps, compId, id, 'appId');

    // choice one from two views.

    // 1. popup dialog
    // DesktopAppActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: DesktopAppDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    DesktopAppActions.showInform({
      compId: compId,
      viewItem: viewItem
    });
    
  };

  handleCreateButton = () => {
    this.props.DesktopAppActions.showDialog({
      viewItem: Map(),
      dialogType: DesktopAppDialog.TYPE_ADD
    });
  }

  handleEditClick = (event, id) => { 
    const { DesktopAppProps, DesktopAppActions } = this.props;
    const viewItem = getRowObjectById(DesktopAppProps, this.props.match.params.grMenuId, id, 'appId');

    DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { DesktopAppProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(DesktopAppProps, this.props.match.params.grMenuId, id, 'appId');
    GRConfirmActions.showConfirm({
      confirmTitle: '데스크톱앱 삭제',
      confirmMsg: '데스크톱앱(' + viewItem.get('appId') + ') 을 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { DesktopAppProps, DesktopAppActions } = this.props;
      DesktopAppActions.deleteDesktopAppData({
        appId: paramObject.get('appId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComp(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
      });
    }
  };

  // ===================================================================
  handleCopyClick = (viewItem) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_COPY
    });
  };

  handleEditItemClick = (viewItem, compType) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { DesktopAppProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;//DesktopAppProps.listParam.rowsPerPage - DesktopAppProps.listData.length;

    const selectedItem = DesktopAppProps.getIn(['viewItems', compId]);

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
                <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
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
                keyId="appId"
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
                      onClick={event => this.handleSelectRow(event, n.get('appId'))}
                      tabIndex={-1}
                      key={n.get('appId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('appInfo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('statusCd')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
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
        <DesktopAppSpec compId={compId}
          specType="inform" 
          selectedItem={selectedItem}
          handleCopyClick={this.handleCopyClick}
          handleEditClick={this.handleEditItemClick}
        />
        <DesktopAppDialog compId={compId} />
        <GRConfirm />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopAppProps: state.DesktopAppModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppManage));



