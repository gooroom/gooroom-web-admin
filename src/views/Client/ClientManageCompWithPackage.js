import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getClientStatusIcon } from 'components/GRUtils/GRCommonUtils';
import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';
import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";

import Search from '@material-ui/icons/Search'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManageCompWithPackage extends Component {

  columnHeaders = [
    { id: "checkbox", isOrder: false, isCheckbox: true},
    { id: 'STATUS_CD', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'GROUP_NAME', isOrder: true, numeric: false, disablePadding: true, label: '단말그룹' },
    { id: 'TOTAL_CNT', isOrder: true, numeric: false, disablePadding: true, label: '패키지수' },
    { id: 'UPDATE_CNT', isOrder: true, numeric: false, disablePadding: true, label: '업데이트수' }
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

  handleClickAllCheck = (event, checked) => {
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientManageProps, compId, 'clientId', checked, true);

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(ClientManageProps, compId, id);  

    ClientManageActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

  }

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps, compId } = this.props;
    const selectRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');

    // const newCheckedIds = setCheckedIdsInComp(ClientManageProps, compId, id);
    // ClientManageActions.changeCompVariable({
    //   name: 'checkedIds',
    //   value: newCheckedIds,
    //   compId: compId
    // });

    if(this.props.onSelect) {
      this.props.onSelect(selectRowObject);
    }
    
    // rest actions..
    
  };

  isChecked = id => {
    const { ClientManageProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientManageProps, compId, 'checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { ClientManageProps, compId } = this.props;
    const selectId = getDataObjectVariableInComp(ClientManageProps, compId, 'selectId');
    return (selectId == id);
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
    ClientManageActions.readClientListPaged(ClientManageProps, compId, {page: 0});
  };

  render() {
    const { classes } = this.props;
    const { ClientManageProps, compId } = this.props;

    const listObj = ClientManageProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
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
              <KeywordOption paramName="keyword" keywordValue={(listObj && listObj.get('listParam')) ? listObj.getIn(['listParam', 'keyword']) : ''}
                handleKeywordChange={this.handleKeywordChange} 
                handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={4} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t('buttonSearch')}
            </Button>
          </Grid>
        </Grid>

        {/* data area */}
        {(listObj && listObj.get('listData')) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="clientId"
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
              const isChecked = this.isChecked(n.get('clientId'));
              const isSelected = this.isSelected(n.get('clientId'));

              return (
                <TableRow
                  hover
                  className={(isSelected) ? classes.grSelectedRow : ''}
                  onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                  role="checkbox"
                  key={n.get('clientId')}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    {(n.get('viewStatus') != 'RVK') &&
                      <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('clientId'))}/>
                    }
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{getClientStatusIcon(n.get('viewStatus'))}</TableCell>
                  <TableCell className={classes.grSmallAndClickAnd}>{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('clientGroupName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('totalCnt')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('updateTargetCnt')}</TableCell>
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
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientManageCompWithPackage));

