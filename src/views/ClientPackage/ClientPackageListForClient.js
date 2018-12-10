import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

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
class ClientPackageListForClient extends Component {

  columnHeaders = [
    { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: "패키지이름" }
  ];

  componentDidMount() {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      clientId: this.props.clientId,
      isFiltered: (this.props.isFiltered) ? this.props.isFiltered : 'false'
    });
  }

  handleChangePage = (event, page) => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      page: page,
      clientId: this.props.clientId,
      isFiltered: (this.props.isFiltered) ? this.props.isFiltered : 'false'
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      rowsPerPage: event.target.value, 
      page: 0, 
      clientId: this.props.clientId,
      isFiltered: (this.props.isFiltered) ? this.props.isFiltered : 'false'
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientPackageActions.readPackageListPagedInClient(this.props.ClientPackageProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc',
      clientId: this.props.clientId,
      isFiltered: (this.props.isFiltered) ? this.props.isFiltered : 'false'
    });
  };
  
  handleSelectBtnClick = () => {
    const { ClientPackageActions, ClientPackageProps, compId } = this.props;
    ClientPackageActions.readPackageListPagedInClient(ClientPackageProps, compId, {
      page: 0, 
      clientId: this.props.clientId,
      isFiltered: (this.props.isFiltered) ? this.props.isFiltered : 'false'
    });
  };

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
    
    const listObj = ClientPackageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={24} alignItems="flex-end" direction="row" justify="flex-start" >
          <Grid item xs={5} >
            <FormControl fullWidth={true}>
              <TextField label="단말아이디" value={this.props.clientId} />
            </FormControl>
          </Grid>

          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>

          <Grid item xs={3} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />조회
            </Button>
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
            columnData={this.columnHeaders}
          />
          <TableBody>
          {listObj.get('listData').map(n => {
            return (
              <TableRow hover key={n.get('packageId')} >
                <TableCell className={classes.grSmallAndClickCell}>{n.get('packageId')}</TableCell>
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
        }
        {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
          <TablePagination
            component='div'
            count={listObj.getIn(['listParam', 'rowsFiltered'])}
            rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
            rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
            page={listObj.getIn(['listParam', 'page'])}
            labelRowsPerPage=""
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageListForClient));


