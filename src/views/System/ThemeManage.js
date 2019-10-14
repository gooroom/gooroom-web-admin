import React, { Component } from 'react';


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
import ThemeSpec from './ThemeSpec';

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
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ThemeManage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openRecordDialog: false,
      recordAdminId: ''
    };
  }

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

  // .................................................
  handleSelectBtnClick = () => {
    const { ThemeManageActions, ThemeManageProps } = this.props;
    ThemeManageActions.readThemeListPaged(ThemeManageProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleKeywordChange = (name, value) => {
    this.props.ThemeManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id) => {
    const { ThemeManageProps, ThemeManageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(ThemeManageProps, compId, id, 'themeId');
    ThemeManageActions.showInform({
      compId: compId,
      viewItem: viewItem,
      isEditable: false
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
    const { t, i18n } = this.props;

    const viewItem = getRowObjectById(ThemeManageProps, this.props.match.params.grMenuId, id, 'themeId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteTheme"),
      confirmMsg: t("msgDeleteTheme", {themeNm: viewItem.get('themeNm')}),
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
        themeId: confirmObject.get('themeId')
      }).then(() => {
        ThemeManageActions.readThemeListPaged(ThemeManageProps, compId);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (viewItem) => {
    this.props.ThemeManageActions.showDialog({
      viewItem: viewItem,
      dialogType: ThemeDialog.TYPE_COPY
    });
  };

  handleClickEdit = (viewItem) => {
    this.props.ThemeManageActions.showDialog({
      viewItem: viewItem,
      dialogType: ThemeDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { ThemeManageProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    let columnHeaders = [
      { id: 'chThemeNm', isOrder: true, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'chThemeId', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: 'chThemeCmt', isOrder: false, numeric: false, disablePadding: true, label: t("colInfo") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") }
    ];

    const listObj = ThemeManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />        
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={4} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()} 
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} style={{textAlign:'right'}}>
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) &&
            <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="themeId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('themeId'))}
                      key={n.get('themeId')}
                    >
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeNm')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeId')}</TableCell>
                    <TableCell className={classes.grSmallAndClickCell}>{n.get('themeCmt')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
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
        <ThemeSpec compId={compId}
          specType="inform" 
          selectedItem={listObj}
          isEditable={false}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ThemeManage)));
