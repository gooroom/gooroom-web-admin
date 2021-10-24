import React, { Component } from 'react';
import { Map, List, Iterable } from 'immutable';
import * as Constants from "components/GRComponents/GRConstants";


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from 'modules/ClientProfileSetModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';
import { getEditAndDeleteRoleWithList } from 'components/GRUtils/GRCommonUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientProfileSetDialog from './ClientProfileSetDialog';
import ClientProfilePackageShowDialog from "views/ClientSupport/ClientProfilePackageShowDialog";

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
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ArchiveIcon from '@material-ui/icons/Archive';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ClientProfileSet extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedProfileNo: '',
      selectedClientId: '',
      keyword: '',
      isOpenClientPackageSelect: false
    };
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientProfileSetActions, ClientProfileSetProps } = this.props;
    ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleSelectRow = (event, id) => {
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const viewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    
    ClientProfileSetActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientProfileSetDialog.TYPE_VIEW
    });
  };

  // create dialog
  handleCreateButton = () => {
    this.props.ClientProfileSetActions.showDialog({
      viewItem: {
        profileNo: '',
        profileNm: '',
        profileCmt: '',
        clientId: '',
        clientItem: {},
        isRemoval: 'false'
      },
      dialogType: ClientProfileSetDialog.TYPE_ADD
    });
  }
  
  handleEditClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const viewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    ClientProfileSetActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientProfileSetDialog.TYPE_EDIT
    });
  };

  handleProfileClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
    const viewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    ClientProfileSetActions.showDialog({
      viewItem: viewItem.merge({
        isRemoval: 'false',
        grpInfoList: List([]), 
        clientInfoList: List([])
      }),
      dialogType: ClientProfileSetDialog.TYPE_PROFILE
    });
  };

  handleClickPackageShow = (event, id) => {
    event.stopPropagation();
    const viewItem = getRowObjectById(this.props.ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    this.setState({
      selectedProfileNo: viewItem.get('profileNo'),
      selectedClientId: viewItem.get('clientId'),
      isOpenClientPackageSelect: true
    });
  };

  handleClickPackageShowClose = () => {
    this.setState({
      keyword: '',
      isOpenClientPackageSelect: false
    });
  }

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientProfileSetProps, ClientProfileSetActions, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;
    const viewItem = getRowObjectById(ClientProfileSetProps, this.props.match.params.grMenuId, id, 'profileNo');
    GRConfirmActions.showConfirm({
      confirmTitle: t("dtDeleteClientProfile"),
      confirmMsg: t("msgDeleteClientProfile", {profileNm: viewItem.get('profileNm')}),
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmObject: viewItem
    });
  };
  handleDeleteConfirmResult = (confirmValue, confirmObject) => {
    if(confirmValue) {
      const { ClientProfileSetProps, ClientProfileSetActions } = this.props;
      const compId = this.props.match.params.grMenuId;
      ClientProfileSetActions.deleteClientProfileSetData({
        compId: compId,
        profileNo: confirmObject.get('profileNo')
      }).then(() => {
          ClientProfileSetActions.readClientProfileSetListPaged(ClientProfileSetProps, compId);
      });
    }
  };
  
  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientProfileSetActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.match.params.grMenuId
    });
  }

  handleLocalKeywordChange = (name, value) => {
    this.setState({
      keyword: value
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientProfileSetProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;

    let columnHeaders = [
      { id: 'chProfileSetNo', isOrder: true, numeric: false, disablePadding: true, label: t("colNumber") },
      { id: 'chProfileSetName', isOrder: true, numeric: false, disablePadding: true, label: t("colName") },
      { id: 'chClientId', isOrder: true, numeric: false, disablePadding: true, label: t("colRefClientId") },
      { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: t("colRegDate") },
      { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: t("colModDate") },
      { id: 'chPackages', isOrder: false, numeric: false, disablePadding: true, label: t("colPackageInfo") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEditDelete") },
      { id: 'chProfile', isOrder: false, numeric: false, disablePadding: true, label: t("colProfile") }
    ];
    
    const listObj = ClientProfileSetProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          {/* data option area */}

          <Grid container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} >
              <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
                <Grid item xs={6} >
                  <FormControl fullWidth={true}>
                    <KeywordOption paramName="keyword" keywordValue={(listObj) ? listObj.getIn(['listParam', 'keyword']) : ''}
                      handleKeywordChange={this.handleKeywordChange} 
                      handleSubmit={() => this.handleSelectBtnClick()} 
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6} >
                  <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                    <Search />{t("btnSearch")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} style={{textAlign:'right'}}>
              <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
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
                keyId="profileNo"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                columnData={columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {

                  let { isEditable, isDeletable } = getEditAndDeleteRoleWithList(n.get('profileNo'), window.gpmsain, this.props.AdminProps.get('adminId'), n.get('regUserId'));

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('profileNo'))}
                      key={n.get('profileNo')}
                    >
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('profileNo')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('profileNm')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>{formatDateToSimple(n.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleClickPackageShow(event, n.get('profileNo'))}>
                          <AssignmentIcon />
                        </Button>                        
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleEditClick(event, n.get('profileNo'))}>
                          <SettingsApplicationsIcon />
                        </Button>
                      }
                      {isDeletable &&
                        <Button color="secondary" size="small" 
                          className={classes.buttonInTableRow}
                          onClick={event => this.handleDeleteClick(event, n.get('profileNo'))}>
                          <DeleteIcon />
                        </Button>
                      }
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      {isEditable &&
                        <TableCell className={classes.grSmallAndClickAndCenterCell}>
                          <Button color="secondary" size="small" 
                            className={classes.buttonInTableRow}
                            onClick={event => this.handleProfileClick(event, n.get('profileNo'))}>
                            <ArchiveIcon />
                          </Button>                        
                        </TableCell>
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
        </GRPane>
        {/* dialog(popup) component area */}
        <ClientProfileSetDialog compId={compId} />
        <ClientProfilePackageShowDialog compId={compId}
          isOpen={this.state.isOpenClientPackageSelect} 
          selectedClientId={this.state.selectedClientId} 
          selectedProfileNo={this.state.selectedProfileNo} 
          onChangeKeyword={this.handleLocalKeywordChange}
          keyword={this.state.keyword}
          isFiltered={false}
          onClose={this.handleClickPackageShowClose} />
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientProfileSetProps: state.ClientProfileSetModule,
  AdminProps: state.AdminModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientProfileSet)));
