import React, { Component } from 'react';
import { Map, List } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { refreshDataListInComps, getRowObjectById, getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { getEditAndDeleteRoleWithList } from 'components/GRUtils/GRCommonUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import CtrlCenterItemDialog from './CtrlCenterItemDialog';
import CtrlCenterItemSpec from './CtrlCenterItemSpec';
import { generateCtrlCenterItemObject } from './CtrlCenterItemSpec';

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


class CtrlCenterItemManage extends Component {

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    CtrlCenterItemActions.readCtrlCenterItemListPaged(CtrlCenterItemProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    CtrlCenterItemActions.readCtrlCenterItemListPaged(CtrlCenterItemProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };
  
  handleChangeSort = (event, columnId, currOrderDir) => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    CtrlCenterItemActions.readCtrlCenterItemListPaged(CtrlCenterItemProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // .................................................
  handleSelectBtnClick = () => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    CtrlCenterItemActions.readCtrlCenterItemListPaged(CtrlCenterItemProps, this.props.match.params.grMenuId, {page: 0});
  };
  
  handleKeywordChange = (name, value) => {
    this.props.CtrlCenterItemActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleSelectRow = (event, id, isEditable) => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const viewItem = getRowObjectById(CtrlCenterItemProps, compId, id, 'objId');

    // choice one from two views.

    // 1. popup dialog
    // CtrlCenterItemActions.showDialog({
    //   viewItem: viewObject,
    //   dialogType: CtrlCenterItemDialog.TYPE_VIEW,
    // });

    // 2. view detail content
    CtrlCenterItemActions.showInform({
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
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: Map({
        adminType: adminType,
        'CTRLITEM': Map({})
      }),
      dialogType: CtrlCenterItemDialog.TYPE_ADD
    });
  }
  
  handleEditListClick = (event, id) => {
    const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;
    const viewItem = getRowObjectById(CtrlCenterItemProps, this.props.match.params.grMenuId, id, 'objId');

    CtrlCenterItemActions.showDialog({
      viewItem: generateCtrlCenterItemObject(viewItem),
      dialogType: CtrlCenterItemDialog.TYPE_EDIT
    });
  };

  // delete
  handleDeleteClick = (event, id) => {
    const { CtrlCenterItemProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(CtrlCenterItemProps, this.props.match.params.grMenuId, id, 'objId');
    GRConfirmActions.showConfirm({
      confirmTitle: t("lbDeleteCTIRule"),
      confirmMsg: t("msgDeleteCTIRule", {objId: viewItem.get('objId')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, paramObject) => {
    if(confirmValue) {
      const { CtrlCenterItemActions, CtrlCenterItemProps } = this.props;

      CtrlCenterItemActions.deleteCtrlCenterItemData({
        objId: paramObject.get('objId'),
        compId: this.props.match.params.grMenuId
      }).then((res) => {
        refreshDataListInComps(CtrlCenterItemProps, CtrlCenterItemActions.readCtrlCenterItemListPaged);
      });
    }
  };

  // ===================================================================
  handleClickCopy = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, targetType);
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: viewItem,
      dialogType: CtrlCenterItemDialog.TYPE_COPY
    });
  };

  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, targetType);
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: generateCtrlCenterItemObject(viewItem, false),
      dialogType: CtrlCenterItemDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { CtrlCenterItemProps } = this.props;
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
    
    const listObj = CtrlCenterItemProps.getIn(['viewItems', compId]);
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
        <CtrlCenterItemSpec compId={compId} specType="inform" 
          selectedItem={(listObj) ? listObj.get('viewItem') : null}
          isEditable={(listObj) ? listObj.get('isEditable') : null}
          hasAction={true} inherit={false}
          onClickCopy={this.handleClickCopy}
          onClickEdit={this.handleClickEdit}
        />
        </GRPane>
        <CtrlCenterItemDialog compId={compId} />
        <GRConfirm />
        
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  CtrlCenterItemProps: state.CtrlCenterItemModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CtrlCenterItemManage)));



