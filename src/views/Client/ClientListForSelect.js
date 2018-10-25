import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import ClientStatusSelect from "views/Options/ClientStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

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


//
//  ## Content ########## ########## ########## ########## ########## 
//
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

  columnHeaders = [
    { id: 'chCheckbox', isCheckbox: true},
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'clientId', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'clientGroupName', isOrder: true, numeric: false,disablePadding: true,label: '단말그룹'},
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' }
  ];

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
    this.handleGetClientList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetClientList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
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
    return (checkedIds && checkedIds.includes(id));
  }

  render() {
    const { classes } = this.props;
    const emptyRows = 0;//UserProps.listParam.rowsPerPage - UserProps.listData.length;
    const listObj = this.state.stateData;

    return (
      <div>
        {/* data option area */}
        <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
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
                  <Search />
                  조회
                </Button>
              </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <GRCommonTableHead
            classes={classes}
            keyId="userId"
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
                    <Checkbox checked={isChecked} className={classes.grObjInCell} />
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientGroupName')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientStatus')}</TableCell>
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

export default withStyles(GRCommonStyle)(ClientListForSelect);

