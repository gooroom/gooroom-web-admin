import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

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
import { GRCommonStyle } from 'templates/styles/GRStyles';


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
    ClientPackageActions.readClientPackageListPaged(ClientPackageProps, this.props.match.params.grMenuId, {page: 0});
  };

  handleSelectRow = (event, id) => {
    const { ClientPackageProps, ClientPackageActions } = this.props;
    const compId = this.props.match.params.grMenuId;

    // const selectRowObject = getRowObjectById(ClientPackageProps, compId, id, 'packageId');
    const newCheckedIds = setCheckedIdsInComp(ClientPackageProps, compId, id);

    ClientPackageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    // if(this.props.onSelect) {
    //   this.props.onSelect(selectRowObject, newCheckedIds);
    // }

    // ClientPackageActions.showInform({
    //   compId: compId,
    //   viewItem: selectRowObject,
    // });
  };
  // .................................................

  // add
  // handleCreateButton = () => {
  //   this.props.ClientPackageActions.showDialog({
  //     viewItem: Map(),
  //     dialogType: ClientPackageDialog.TYPE_ADD
  //   });
  // }

  // edit
  // handleEditClick = (event, id) => {
  //   event.stopPropagation();
  //   const { ClientPackageProps, ClientPackageActions } = this.props;
  //   const viewItem = getRowObjectById(ClientPackageProps, this.props.match.params.grMenuId, id, 'packageId');
  //   ClientPackageActions.showDialog({
  //     viewItem: viewItem,
  //     dialogType: ClientPackageDialog.TYPE_EDIT
  //   });
  // };

  handleClickAllCheck = (event, checked) => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientPackageProps, compId, 'packageId', checked);
    ClientPackageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  isChecked = id => {
    const { ClientPackageProps } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientPackageProps, this.props.match.params.grMenuId, 'checkedIds');
    return (checkedIds && checkedIds.includes(id));
  }
  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientPackageActions.changeListParamData({
      name: name, 
      value: value,
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
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={6} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >
              <Grid item xs={6} >
                <FormControl fullWidth={true}>
                  <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
                </FormControl>
              </Grid>
              <Grid item xs={6} >
                <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
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
          {(listObj) && 
            <div>
            <Table>
              <GRCommonTableHead
                classes={classes}
                keyId="packageId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onClickAllCheck={this.handleClickAllCheck}
                checkedIds={listObj.get('checkedIds')}
                listData={listObj.get('listData')}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {listObj.get('listData').map(n => {
                  const isChecked = this.isChecked(n.get('packageId'));
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleSelectRow(event, n.get('packageId'))}
                      role="checkbox"
                      aria-checked={isChecked}
                      key={n.get('packageId')}
                      selected={isChecked}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                        <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} />
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

        </GRPane>
        <ClientPackageInform compId={compId} />
        <ClientPackageDialog compId={compId} />
        <GRConfirm />
      </React.Fragment>

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageMenu));


