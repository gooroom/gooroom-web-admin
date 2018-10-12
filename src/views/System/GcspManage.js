import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GcspManageActions from 'modules/GcspManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GcspDialog from './GcspDialog';

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

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import BuildIcon from '@material-ui/icons/Build';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GcspManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openRecordDialog: false,
      recordAdminId: ''
    };
  }

  columnHeaders = [
    { id: 'chGcspNm', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chGcspId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chRegDt', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chRegUser', isOrder: true, numeric: false, disablePadding: true, label: '등록자' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { GcspManageActions, GcspManageProps } = this.props;
    GcspManageActions.readGcspListPaged(GcspManageProps, this.props.match.params.grMenuId);
  };
  
  handleRowClick = (event, id) => {
    const { GcspManageProps, GcspManageActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GcspManageActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: GcspDialog.TYPE_VIEW
    });
  };
      
  // create dialog
  handleCreateButton = () => {
    this.props.GcspManageActions.showDialog({
      selectedViewItem: {
        gcspId: '',
        certGubun: 'cert1'
      },
      dialogType: GcspDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { GcspManageProps, GcspManageActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GcspManageActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: GcspDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { GcspManageProps, GRConfirmActions } = this.props;
    const selectedViewItem = getRowObjectById(GcspManageProps, this.props.match.params.grMenuId, id, 'gcspId');
    GRConfirmActions.showConfirm({
      confirmTitle: '클라우드서비스 삭제',
      confirmMsg: '클라우드서비스(' + selectedViewItem.get('gcspId') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true,
      confirmObject: selectedViewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { GcspManageProps, GcspManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      GcspManageActions.deleteGcspData({
        gcspId: confirmObject.get('gcspId')
      }).then(() => {
        GcspManageActions.readGcspListPaged(GcspManageProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.GcspManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { GcspManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = GcspManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={4} >
                <FormControl fullWidth={true}>
                  <UserStatusSelect onChangeSelect={this.handleChangeUserStatusSelect} />
                </FormControl>
              </Grid>
              <Grid item xs={4} >
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>
              <Grid item xs={4} >
                <Button size="small" variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
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
                keyId="gcspId"
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
                      onClick={event => this.handleRowClick(event, n.get('gcspId'))}
                      key={n.get('gcspId')}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('gcspNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('gcspId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDt'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleEditClick(event, n.get('gcspId'))}>
                          <BuildIcon />
                        </Button>
                        <Button size="small" color="secondary" 
                          className={classes.buttonInTableRow} 
                          onClick={event => this.handleDeleteClick(event, n.get('gcspId'))}>
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
        <GcspDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  GcspManageProps: state.GcspManageModule
});

const mapDispatchToProps = (dispatch) => ({
  GcspManageActions: bindActionCreators(GcspManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GcspManage));
