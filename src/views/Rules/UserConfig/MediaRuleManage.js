import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { refreshDataListInComp, getRowObjectById } from 'components/GrUtils/GrTableListUtils';

import { generateConfigObject } from './MediaRuleInform';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import MediaRuleDialog from './MediaRuleDialog';
import MediaRuleInform from './MediaRuleInform';
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
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

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
      rowsPerPage: event.target.value,
      page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId, {
      orderColumn: columnId,
      orderDir: orderDir
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { MediaRuleActions, MediaRuleProps } = this.props;
    MediaRuleActions.readMediaRuleListPaged(MediaRuleProps, this.props.match.params.grMenuId);
  };
  
  handleKeywordChange = name => event => {
    this.props.MediaRuleActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
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
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { MediaRuleProps, GrConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(MediaRuleProps, this.props.match.params.grMenuId, id, 'objId');
    GrConfirmActions.showConfirm({
      confirmTitle: '매체제어정책정보 삭제',
      confirmMsg: '매체제어정책정보(' + selectedViewItem.get('objId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
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

  render() {
    const { classes } = this.props;
    const { MediaRuleProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;

    const listObj = MediaRuleProps.getIn(['viewItems', compId]);

    return (
      <div>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={6}>
                <FormControl fullWidth={true}>
                  <TextField id='keyword' label='검색어' value={this.state.keyword} onChange={this.handleKeywordChange('keyword')} margin='dense' />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />조회
                </Button>
              </Grid>

            </Grid>

            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end" >
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
                <AddIcon />등록
              </Button>
            </Grid>
          </Grid>            

          {/* data area */}
          {(listObj) &&
          <div>
            <Table>
              <GrCommonTableHead
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
                      className={classes.grNormalTableRow}
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
        </GrPane>
        {/* dialog(popup) component area */}
        <MediaRuleInform compId={compId} />
        <MediaRuleDialog compId={compId} />
        <GrConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(MediaRuleManage));



