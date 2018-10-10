import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';
import KeywordOption from "views/Options/KeywordOption";

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
import InputLabel from "@material-ui/core/InputLabel";

import Search from '@material-ui/icons/Search'; 

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientWithPackageComp extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'chClientId', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'chClientNm', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'chClientGroupNm', isOrder: true, numeric: false, disablePadding: true, label: '단말그룹' },
    { id: 'chPackageCount', isOrder: true, numeric: false, disablePadding: true, label: '패키지수' },
    { id: 'chUpdateCount', isOrder: true, numeric: false, disablePadding: true, label: '업데이트수' }
  ];

  componentDidMount() {
    const { ClientManageActions, ClientManageProps, compId, } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId);
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      rowsPerPage: event.target.value, page:0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const newSelectedIds = setAllSelectedIdsInComp(ClientManageProps, compId, 'clientId', checked);

    ClientManageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;

    const clickedRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');
    const newSelectedIds = setSelectedIdsInComp(ClientManageProps, compId, id);

    ClientManageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    if(this.props.onSelect) {
      this.props.onSelect(clickedRowObject, newSelectedIds);
    }
    
    // rest actions..
    
  };

  isSelected = id => {
    const { ClientManageProps, compId } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientManageProps, compId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }

  // .................................................
  handleChangeClientStatusSelect = (event, property) => {
    // this.props.ClientManageActions.changeListParamData({
    //   name: 'clientType', 
    //   value: property,
    //   compId: this.props.compId
    // });
    const { ClientManageProps, ClientManageActions, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {
      clientType: property, page:0
    });

  };

  handleKeywordChange = (name, value) => {
    this.props.ClientManageActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, compId);
  };

  render() {
    const { classes } = this.props;
    const { ClientManageProps, compId } = this.props;

    const listObj = ClientManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (

      <div>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="client-status">단말상태</InputLabel>
              <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
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

        {/* data area */}
        {listObj &&
        <Table>
          <GrCommonTableHead
            classes={classes}
            keyId="clientId"
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
              const isSelected = this.isSelected(n.get('clientId'));
              return (
                <TableRow
                  className={classes.grNormalTableRow}
                  hover
                  onClick={event => this.handleRowClick(event, n.get('clientId'))}
                  role="checkbox"
                  aria-checked={isSelected}
                  key={n.get('clientId')}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isSelected} className={classes.grObjInCell} />
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientGroupName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('totalCnt')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{Number(n.get('updateTargetCnt')) + Number(n.get('updateMainOsCnt'))}</TableCell>
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
          labelDisplayedRows={() => {return ''}}
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
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientWithPackageComp));

