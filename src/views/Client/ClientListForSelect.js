import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import ClientStatusSelect from "views/Options/ClientStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import { getClientStatusIcon } from 'components/GRUtils/GRCommonUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';

import Checkbox from "@material-ui/core/Checkbox";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";


class ClientListForSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          clientType: 'ALL',
          groupId: '',
          keyword: '',
          orderDir: 'asc',
          orderColumn: 'CLIENT_NM',
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

  handleGetClientList = (newListParam) => {

    requestPostAPI('readClientListPaged', {
      clientType: newListParam.get('clientType'),
      groupId: newListParam.get('groupId'),
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
        });
      }
    ).catch(error => {
    });
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  // componentWillReceiveProps(newProps) {
  //   const { stateData } = this.state;
  //   const newListParam = (stateData.get('listParam')).merge({
  //     deptCd: newProps.deptCd
  //   });
  //   this.handleGetClientList(newListParam);
  // }

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.setState({ stateData: stateData.set('checkedIds', List([])) });
    this.props.onSelectClient(List([]));
    this.handleGetClientList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.setState({ stateData: stateData.set('checkedIds', List([])) });
    this.props.onSelectClient(List([]));
    this.handleGetClientList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.setState({ stateData: stateData.set('checkedIds', List([])) });
    this.props.onSelectClient(List([]));
    this.handleGetClientList(newListParam);
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
    this.props.onSelectClient(newCheckedIds);
  };
    
  handleClickAllCheck = (event, checked) => {
    const { stateData } = this.state;
    let newCheckedIds = List([]);

    if(checked) {
      stateData.get('listData').map(n => {
        newCheckedIds = newCheckedIds.push(n.get('clientId'));
      });
    }

    this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    this.props.onSelectClient(newCheckedIds);
  };

  handleChangeClientStatusSelect = (event, property) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      clientType: property, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    this.handleGetClientList(newListParam);
  }

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      keyword: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    // 아래 커멘트 제거시, 타이프 칠때마다 조회
    //this.handleGetClientList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetClientList(newListParam);
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
      { id: 'checkbox', isCheckbox: true},
      { id: 'CLIENT_NM', isOrder: true, numeric: false, disablePadding: true, label: t("colClientName") },
      { id: 'CLIENT_ID', isOrder: true, numeric: false, disablePadding: true, label: t("colClientId") },
      { id: 'GROUP_NAME', isOrder: true, numeric: false,disablePadding: true,label: t("colClientGroup")},
      { id: 'STATUS_CD', isOrder: true, numeric: false, disablePadding: true, label: t("colStatus") }
    ];
    
    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4} >
            <FormControl fullWidth={true}>
              <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <KeywordOption handleKeywordChange={this.handleKeywordChange} />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search /> {t("btnSearch")}
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
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
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {
              const isChecked = this.isChecked(n.get('clientId'));
              return (
                <TableRow
                  hover
                  onClick={event => this.handleSelectRow(event, n.get('clientId'))}
                  role="checkbox"
                  aria-checked={isChecked}
                  key={n.get('clientId')}
                  selected={isChecked}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox color="primary" checked={isChecked} className={classes.grObjInCell} />
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientGroupName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{getClientStatusIcon(n.get('viewStatus'))}</TableCell>
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

export default translate("translations")(withStyles(GRCommonStyle)(ClientListForSelect));

