import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComp, getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import MediaRuleDialog from './MediaRuleDialog';
import MediaRuleSpec from './MediaRuleSpec';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

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
class MediaRuleManage extends Component {

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
      isOpenSpec: false
    }
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = (name, value) => {
    this.props.MediaRuleActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleRowClick = (event, id) => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const selectedViewItem = getRowObjectById(MediaRuleProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // MediaRuleActions.showDialog({
    //   selectedViewItem: viewObject,
    //   dialogType: MediaRuleDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    MediaRuleActions.showInform({
      compId: compId,
      selectedViewItem: selectedViewItem
    });
  };

  handleCreateButton = () => {
    this.props.MediaRuleActions.showDialog({
      selectedViewItem: Map(),
      dialogType: MediaRuleDialog.TYPE_ADD
    });
  }
  
  handleEditClick = (event, id) => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    const selectedViewItem = getRowObjectById(MediaRuleProps, this.props.match.params.grMenuId, id, 'objId');

    MediaRuleActions.showDialog({
      selectedViewItem: MediaRuleSpec.generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { MediaRuleProps, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(MediaRuleProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: '매체제어정책정보 삭제',
      confirmMsg: '매체제어정책정보(' + selectedViewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { MediaRuleActions, MediaRuleProps } = this.props;

      MediaRuleActions.deleteMediaRuleData({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComp(MediaRuleProps, MediaRuleActions.readMediaRuleListPaged);
      });
    }
  };

  // ===================================================================
  handleCopyClick = (selectedViewItem) => {
    const { MediaRuleActions } = this.props;
    MediaRuleActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: MediaRuleDialog.TYPE_COPY
    });
  };

  handleEditClick = (viewItem, compType) => {
    //const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(MediaRuleProps, compId, targetType);
    this.props.MediaRuleActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { MediaRuleProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;

    const listObj = MediaRuleProps.getIn(['viewItems', compId]);
    //console.log('listObj :::::::::: ', listObj);
    const selectedItem = (listObj) ? listObj.get('selectedViewItem') : null;

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
          {(listObj) &&
          <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="objId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
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
                          onClick={event => this.handleEditClick(event, n.get('objId'))}>
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
          </div>
        }
        </GRPane>
        {/* dialog(popup) component area */}
        <MediaRuleSpec 
          specType="inform" 
          isOpen={this.state.isOpenSpec} 
          selectedItem={selectedItem}
          handleCopyClick={this.handleCopyClick}
          handleEditClick={this.handleEditClick}
        />
        <MediaRuleDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(MediaRuleManage));



