import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ThemeManageActions from 'modules/ThemeManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ThemeDialog from './ThemeDialog';

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
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ListIcon from '@material-ui/icons/List';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class ThemeManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openRecordDialog: false,
      recordAdminId: ''
    };
  }

  columnHeaders = [
    { id: 'chThemeNm', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chThemeId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chThemeCmt', isOrder: false, numeric: false, disablePadding: true, label: '설명' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ThemeManageActions, ThemeManageProps } = this.props;
    ThemeManageActions.readThemeListPaged(ThemeManageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ThemeManageActions, ThemeManageProps } = this.props;
    ThemeManageActions.readThemeListPaged(ThemeManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ThemeManageActions, ThemeManageProps } = this.props;
    ThemeManageActions.readThemeListPaged(ThemeManageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ThemeManageActions, ThemeManageProps } = this.props;
    ThemeManageActions.readThemeListPaged(ThemeManageProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleSelectRow = (event, id) => {
    const { ThemeManageProps, ThemeManageActions } = this.props;
    const viewItem = getRowObjectById(ThemeManageProps, this.props.match.params.grMenuId, id, 'adminId');
    ThemeManageActions.showDialog({
      viewItem: viewItem,
      dialogType: ThemeDialog.TYPE_VIEW
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.ThemeManageActions.showDialog({
      viewItem: {
        themeId: ''
      },
      dialogType: ThemeDialog.TYPE_ADD
    });
  }
  
  // edit dialog
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ThemeManageProps, ThemeManageActions } = this.props;
    const viewItem = getRowObjectById(ThemeManageProps, this.props.match.params.grMenuId, id, 'themeId');
    ThemeManageActions.showDialog({
      viewItem: viewItem,
      dialogType: ThemeDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ThemeManageProps, GRConfirmActions } = this.props;
    const viewItem = getRowObjectById(ThemeManageProps, this.props.match.params.grMenuId, id, 'themeId');
    GRConfirmActions.showConfirm({
      confirmTitle: '테마 삭제',
      confirmMsg: '테마(' + viewItem.get('adminNm') + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ThemeManageProps, ThemeManageActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ThemeManageActions.deleteThemeData({
        compId: compId,
        adminId: confirmObject.get('themeId')
      }).then(() => {
        ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
      });
    }
  };

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ThemeManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ThemeManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const listObj = ThemeManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={4} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                  </FormControl>
                </Grid>
                <Grid item xs={4} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />조회
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}}>
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
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
                keyId="adminId"
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
                      onClick={event => this.handleSelectRow(event, n.get('adminId'))}
                      key={n.get('adminId')}
                    >
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeNm')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeId')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeCmt')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>
                      <Button size="small" color="secondary" 
                        className={classes.buttonInTableRow} 
                        onClick={event => this.handleEditClick(event, n.get('themeId'))}>
                        <SettingsApplicationsIcon />
                      </Button>
                      <Button size="small" color="secondary" 
                        className={classes.buttonInTableRow} 
                        onClick={event => this.handleDeleteClick(event, n.get('themeId'))}>
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
        <ThemeDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ThemeManageProps: state.ThemeManageModule
});

const mapDispatchToProps = (dispatch) => ({
  ThemeManageActions: bindActionCreators(ThemeManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeManage));
