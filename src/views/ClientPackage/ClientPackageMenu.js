import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrPane from 'containers/GrContent/GrPane';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search'; 
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import ClientPackageDialog from './ClientPackageDialog';
import ClientPackageInform from './ClientPackageInform';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


class ClientPackageMenu extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: "패키지이름" },
    { id: "chPackageArch", isOrder: true, numeric: false, disablePadding: true, label: "아키텍쳐" },
    { id: "chPackageLastVer", isOrder: true, numeric: false, disablePadding: true, label: "버전" }
  ];

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // .................................................
  handleChangePage = (event, page) => {
    const { ClientPackageActions, ClientPackageProps } = this.props;
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientPackageActions, ClientPackageProps } = this.props;
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientPackageActions, ClientPackageProps } = this.props;
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, this.props.match.params.grMenuId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageActions, ClientPackageProps } = this.props;
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, this.props.match.params.grMenuId);
  };

  handleRowClick = (event, id) => {
    const { ClientPackageProps, ClientPackageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // const clickedRowObject = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    const newSelectedIds = setSelectedIdsInComp(ClientPackageProps, compId, id);

    ClientPackageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    // if(this.props.onSelect) {
    //   this.props.onSelect(clickedRowObject, newSelectedIds);
    // }

    // ClientPackageActions.showInform({
    //   compId: compId,
    //   selectedViewItem: clickedRowObject,
    // });
  };
  // .................................................

  // add
  // handleCreateButton = () => {
  //   this.props.ClientPackageActions.showDialog({
  //     selectedViewItem: Map(),
  //     dialogType: ClientPackageDialog.TYPE_ADD
  //   });
  // }

  // edit
  // handleEditClick = (event, id) => {
  //   event.stopPropagation();
  //   const { ClientPackageProps, ClientPackageActions } = this.props;
  //   const selectedViewItem = getRowObjectById(ClientPackageProps, this.props.match.params.grMenuId, id, 'packageId');
  //   ClientPackageActions.showDialog({
  //     selectedViewItem: selectedViewItem,
  //     dialogType: ClientPackageDialog.TYPE_EDIT
  //   });
  // };

  handleSelectAllClick = (event, checked) => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    const newSelectedIds = setAllSelectedIdsInComp(ClientPackageProps, compId, 'packageId', checked);
    ClientPackageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  isSelected = id => {
    const { ClientPackageProps } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientPackageProps, this.props.match.params.grMenuId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }
  // .................................................
  handleKeywordChange = name => event => {
    this.props.ClientPackageActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientPackageProps.listParam.rowsPerPage - ClientPackageProps.listData.length;

    const listObj = ClientPackageProps.getIn(['viewItems', compId]);

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
              <Grid item xs={6} >
                <FormControl fullWidth={true}>
                  <TextField id='keyword' label='검색어' onChange={this.handleKeywordChange('keyword')} />
                </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />조회
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={6} container alignItems="flex-end" direction="row" justify="flex-end">
            {/*
              <Button size="small" variant="contained" color="primary" onClick={() => { this.handleCreateButton(); }} >
                <AddIcon />등록
              </Button>
            */}
            </Grid>
          </Grid>

          {/* data area */}
          {(listObj) && 
            <div>
            <Table>
              <GrCommonTableHead
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
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.get('packageId'))}
                      role="checkbox"
                      aria-checked={isSelected}
                      key={n.get('packageId')}
                      selected={isSelected}
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
                  <TableCell
                    colSpan={this.columnHeaders.length + 1}
                    className={classes.grSmallAndClickCell}
                  />
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
        <ClientPackageInform compId={compId} />
        <ClientPackageDialog compId={compId} />
        <GrConfirm />
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientPackageMenu));


