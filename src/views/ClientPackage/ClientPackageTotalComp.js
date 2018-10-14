import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import GRConfirm from 'components/GRComponents/GRConfirm';
import ClientPackageDialog from './ClientPackageDialog';

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
import Checkbox from "@material-ui/core/Checkbox";

import Search from '@material-ui/icons/Search'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientPackageComp extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: "패키지이름" },
    { id: "chPackageArch", isOrder: true, numeric: false, disablePadding: true, label: "아키텍쳐" },
    { id: "chPackageLastVer", isOrder: true, numeric: false, disablePadding: true, label: "버전" }
  ];

  componentDidMount() {
    this.props.ClientPackageActions.readClientPackageListPaged(this.props.ClientPackageProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.ClientPackageActions.readClientPackageListPaged(this.props.ClientPackageProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientPackageActions.readClientPackageListPaged(this.props.ClientPackageProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientPackageActions.readClientPackageListPaged(this.props.ClientPackageProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };
  

  // edit
  handleEditClick = (event, id) => {
    const { ClientPackageProps, ClientPackageActions, compId } = this.props;
    const selectedViewItem = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    ClientPackageActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientPackageDialog.TYPE_EDIT
    });
  };
  
  handleSelectAllClick = (event, checked) => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    const newSelectedIds = setAllSelectedIdsInComp(ClientPackageProps, compId, 'packageId', checked);
    ClientPackageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, compId);
  };

  handleRowClick = (event, id) => {
    const { ClientPackageProps, compId } = this.props;
    const { ClientPackageActions, ClientConfSettingActions, ClientHostNameActions, ClientUpdateServerActions, ClientDesktopConfigActions } = this.props;
    const { BrowserRuleActions, MediaRuleActions, SecurityRuleActions } = this.props;

    const clickedRowObject = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    const newSelectedIds = setSelectedIdsInComp(ClientPackageProps, compId, id);

    ClientPackageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject, newSelectedIds);
    }
  };

  isSelected = id => {
    const { ClientPackageProps, compId } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientPackageProps, compId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientPackageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageProps, compId } = this.props;
    const emptyRows = 0;// = ClientPackageProps.listParam.rowsPerPage - ClientPackageProps.listData.length;
    const listObj = ClientPackageProps.getIn(['viewItems', compId]);

    return (

      <div>
        {/* data option area */}
        <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
            <Grid item xs={6} >
              <FormControl fullWidth={true}>
                <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
              </FormControl>
            </Grid>
            <Grid item xs={6} >
              <Button className={classes.GRIconSmallButton} variant="outlined" color="secondary" onClick={() => this.handleSelectBtnClick()} >
                <Search />조회
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end">
          {/*
            <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
              <AddIcon />등록
            </Button>
          */}
          </Grid>
        </Grid>

        {/* data area */}
        {listObj &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="packageId"
            orderDir={listObj.getIn(['listParam', 'orderDir'])}
            orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
            onRequestSort={this.handleChangeSort}
            onSelectAllClick={this.handleSelectAllClick}
            selectedIds={listObj.get('selectedIds')}
            listData={listObj.get('listData')}
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.get('listData').map(n => {
            const isSelected = this.isSelected(n.get('packageId'));
            return (
              <TableRow
                hover
                onClick={event => this.handleRowClick(event, n.get('packageId'))}
                key={n.get('packageId')}
              >
                <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                  <Checkbox checked={isSelected} className={classes.grObjInCell} />
                </TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('packageId')}</TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('packageArch')}</TableCell>
                <TableCell className={classes.grSmallAndClickCell}>{n.get('packageLastVer')}</TableCell>
              </TableRow>
            );
          })}

          {emptyRows > 0 && (
            <TableRow >
              <TableCell colSpan={this.columnHeaders.length + 1}
                className={classes.grSmallAndClickCell}
              />
            </TableRow>
          )}
          </TableBody>
        </Table>
        }
        {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
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
        }
        <ClientPackageDialog compId={compId} />
        <GRConfirm />
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageComp));


