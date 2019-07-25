import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

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
import { translate, Trans } from "react-i18next";

class UserListForSelectByDept extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          status: 'STAT010',
          keyword: '',
          deptCd: props.deptCd,
          orderDir: 'asc',
          orderColumn: 'chUserNm',
          page: 0,
          rowsPerPage: 5,
          rowsPerPageOptions: List([5, 10]),
          rowsTotal: 0,
          rowsFiltered: 0
        })
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.deptCd !== nextProps.deptCd) {
      if(nextProps.deptCd) {
        const { stateData } = this.state;
        const newListParam = (stateData.get('listParam')).merge({
          deptCd: nextProps.deptCd
        });
        this.handleGetUserList(newListParam);
      }
    }
  }

  handleGetUserList = (newListParam) => {
    requestPostAPI('readUserListPagedInDept', {
      deptCd: newListParam.get('deptCd'),
      keyword: newListParam.get('keyword'),
      status: newListParam.get('status'),
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

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetUserList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetUserList(newListParam);
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetUserList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { stateData } = this.state;
    if(stateData.get('listData')) {
      const viewItem = stateData.get('listData').find((element) => {
          return element.get('userId') == id;
      });

      const selectedUser = (viewItem) ? fromJS(viewItem.toJS()) : null;
      if(selectedUser) {
        this.props.onSelectUser(event.target.checked, {
          userId: selectedUser.get('userId'),
          userNm: selectedUser.get('userNm'),
          deptCd: selectedUser.get('deptCd'),
          deptNm: selectedUser.get('deptNm')
        });
      }
    } 
  };

  handleClickAllCheck = (event, checked) => {
    const { stateData } = this.state;
    let newCheckedIds = List([]);

    if(checked) {
      stateData.get('listData').map(n => {
        newCheckedIds = newCheckedIds.push(n.get('userId'));
      });
    }
    this.props.onSelectUser(newCheckedIds);
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
    // this.handleGetUserList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetUserList(newListParam);
  };

  isChecked = id => {
    const { checkedUser } = this.props;

    if(checkedUser && checkedUser.size > 0) {
      const userInfo = checkedUser.find(e => (e.get('value') == id));
      return userInfo ? true : false;
    } else {
      return false;
    }
  }

  render() {
    const { classes, checkedUser } = this.props;
    const { t, i18n } = this.props;

    const columnHeaders = [
      { id: 'chCheckbox', isCheckbox: true},
      { id: 'chUserId', isOrder: true, numeric: false, disablePadding: true, label: t("colId") },
      { id: 'chUserNm', isOrder: true, numeric: false, disablePadding: true, label: t("colUserNm") },
      { id: 'chDeptNm', isOrder: true, numeric: false, disablePadding: true, label: t("colDeptNm") }      
    ];
    
    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    let checkedIds = [];
    if(checkedUser && checkedUser.size > 0) {
      checkedIds = checkedUser.map(e => (e.get('value')));
    }

    return (
      <div>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={8} style={{paddingLeft:20,paddingRight:10}}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" 
                handleKeywordChange={this.handleKeywordChange} 
                handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={4} style={{paddingLeft:10,paddingRight:20,textAlign:'right'}} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search />{t("btnSearch")}
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
            checkedIds={checkedIds}
            listData={listObj.get('listData')}
            columnData={columnHeaders}
          />
          <TableBody>
            {listObj.get('listData').map(n => {
              const isChecked = this.isChecked(n.get('userId'));
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isChecked}
                  key={n.get('userId')}
                  selected={isChecked}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} 
                    onClick={event => this.handleSelectRow(event, n.get('userId'))}
                    />
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
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

export default translate("translations")(withStyles(GRCommonStyle)(UserListForSelectByDept));

