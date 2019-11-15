import React, { Component } from 'react';
import { Map, List } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { getEditAndDeleteRoleWithList } from 'components/GRUtils/GRCommonUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import SoftwareFilterDialog from './SoftwareFilterDialog';
import SoftwareFilterSpec from './SoftwareFilterSpec';
import { generateSoftwareFilterObject } from './SoftwareFilterSpec';

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
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class SoftwareFilterManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    SoftwareFilterActions.readSoftwareFilterListPaged(SoftwareFilterProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.SoftwareFilterActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id, isEditable) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(SoftwareFilterProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // SoftwareFilterActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: SoftwareFilterDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    SoftwareFilterActions.showInform({
      compId: compId,
      viewItem: viewItem,
      isEditable: isEditable
    });
  };

  handleCreateButton = () => {
    let adminType = 'A';
    if(window.gpmsain === Constants.SUPER_RULECODE) {
      adminType = 'S';
    }
    this.props.SoftwareFilterActions.showDialog({
      viewItem: Map({
        adminType: adminType,
        'SWITEM': Map({})
      }),
      dialogType: SoftwareFilterDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { SoftwareFilterActions, SoftwareFilterProps } = this.props;
    const viewItem = getRowObjectById(SoftwareFilterProps, this.props.match.params.grMenuId, id, 'objId');

    SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem),
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { SoftwareFilterProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(SoftwareFilterProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteSWRule"),
      confirmMsg: t("msgDeleteSWRule", {objId: viewItem.get('objId')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { SoftwareFilterActions, SoftwareFilterProps } = this.props;

      SoftwareFilterActions.deleteSoftwareFilterData({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(SoftwareFilterProps, SoftwareFilterActions.readSoftwareFilterListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem, false),
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { SoftwareFilterProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    const columnHeaders = [
      { id: 'chConfGubun', isOrder: false, numeric: false, disablePadding: true, label: t("colDivision") },
      { id: 'chConfName', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleName") },
      { id: 'chConfId', isOrder: true, numeric: false, disablePadding: true, label: t("colRuleId") },
      { id: 'chModUser', isOrder: true, numeric: false, disablePadding: true, label: t("colModUser") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chRegUser', isOrder: true, numeric: false, disablePadding: true, label: t("colRegUser") },
      { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") }
    ];
    
    const listObj = SoftwareFilterProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}
          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()} 
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{textAlign:'right'}}>
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); } } >
                <AddIcon />{t("btnRegist")}
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
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let { isEditable, isDeletable } = getEditAndDeleteRoleWithList(n.get('objId'), window.gpmsain, this.props.AdminProps.get('adminId'), n.get('regUserId'));

                  return (
                    <TableRow 
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('objId'), isEditable)}
                      tabIndex={-1}
                      key={n.get('objId')}
                      className={(n.get('objId').endsWith('DEFAULT')) ? classes.grDefaultRuleRow : ((n.get('objId').endsWith('STD')) ? classes.grStandardRuleRow : "")}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId').endsWith('DEFAULT') ? t("selBasic") : (n.get('objId').endsWith('STD') ? t("selStandard") : t("selOrdinary"))}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('objNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('objId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('modUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('regUserId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditListClick(event, n.get('objId'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isDeletable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('objId'))}>
                          <DeleteIcon />
                        </Button>
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
        {/* dialog(popup) component area */}
        <SoftwareFilterSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          isEditable={(listObj) ? listObj.get('isEditable') : null}
          hasAction={true} inherit={false}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <SoftwareFilterDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  SoftwareFilterProps: state.SoftwareFilterModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SoftwareFilterManage)));



