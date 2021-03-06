import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import KeywordOption from "views/Options/KeywordOption";
import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

import { requestPostAPI } from 'components/GRUtils/GRRequester';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientPackageTotalListForSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          keyword: '',
          orderDir: 'asc',
          orderColumn: 'clientName',
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: List([5, 10, 25]),
          rowsTotal: 0,
          rowsFiltered: 0
        }),
        checkedIds: List([])
      })
    };
  }

  handleGetPackageTotalList = (newListParam) => {

    requestPostAPI('readTotalPackageListPaged', {
      keyword: newListParam.get('keyword'),
      page: newListParam.get('page'),
      start: newListParam.get('page') * newListParam.get('rowsPerPage'),
      length: newListParam.get('rowsPerPage'),
      orderColumn: newListParam.get('orderColumn'),
      orderDir: newListParam.get('orderDir')
    }).then(
      (response) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = response.data;
        const { stateData } = this.state;
        this.setState({
          stateData: stateData
            .set('listData', List(data.map((e) => {return Map(e)})))
            .set('listParam', newListParam.merge({
              rowsFiltered: parseInt(recordsFiltered, 10),
              rowsTotal: parseInt(recordsTotal, 10),
              page: parseInt(draw, 10),
              rowsPerPage: parseInt(rowLength, 10),
              orderColumn: orderColumn,
              orderDir: orderDir
            }))
            .set('checkedIds', List([]))
        });
      }
    ).catch(error => {
    });
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetPackageTotalList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetPackageTotalList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetPackageTotalList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
    const { stateData } = this.state;
    const checkedIds = stateData.get('checkedIds');
    let newCheckedIds = null;
    if(checkedIds) {
        const indexNo = checkedIds.indexOf(id);
        if(indexNo > -1) {
          newCheckedIds = checkedIds.delete(indexNo);
        } else {
          newCheckedIds = checkedIds.push(id);
        }
    } else {
      newCheckedIds = List([id]);
    }
    this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    this.props.onSelectPackage(newCheckedIds);
  };

  handleClickAllCheck = (event, checked) => {
    const { stateData } = this.state;
    let newCheckedIds = List([]);
    if(checked) {
      const listData = stateData.get('listData');
      newCheckedIds = (listData) ? listData.map((e) => (e.get('packageId'))) : List([]);
    }

    this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    this.props.onSelectPackage(newCheckedIds);
  };

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      keyword: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    // 아래 커멘트 제거시, 타이프 칠때마다 조회
    //this.handleGetPackageTotalList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetPackageTotalList(newListParam);
  };

  isChecked = id => {
    const checkedIds = this.state.stateData.get('checkedIds');
    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: "chCheckbox", isCheckbox: true},
      { id: "chPackageId", isOrder: true, numeric: false, disablePadding: true, label: t("colPackageName") },
      { id: "chPackageArch", isOrder: true, numeric: false, disablePadding: true, label: t("colArchitecture") },
      { id: "chPackageLastVer", isOrder: true, numeric: false, disablePadding: true, label: t("colVersion") }
    ];
    
    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={6}>
            <FormControl fullWidth={true}>
              <KeywordOption handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
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
            columnData={columnHeaders}
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

export default translate("translations")(withStyles(GRCommonStyle)(ClientPackageTotalListForSelect));

