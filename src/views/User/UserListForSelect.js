import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import * as UserActions from 'modules/UserModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import UserStatusSelect from "views/Options/UserStatusSelect";
import KeywordOption from "views/Options/KeywordOption";

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrConfirm from 'components/GrComponents/GrConfirm';

import UserDialog from "views/User/UserDialog";
import UserInform from "views/User/UserInform";
import GrPane from "containers/GrContent/GrPane";
import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

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
import AddIcon from "@material-ui/icons/Add";
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import { requestPostAPI } from 'components/GrUtils/GrRequester';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserListForSelect extends Component {

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
          orderColumn: 'chUserName',
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: List([5, 10, 25]),
          rowsTotal: 0,
          rowsFiltered: 0
        }),
        selectedIds: List([])
      })
    };
  }

  columnHeaders = [
    { id: 'chCheckbox', isCheckbox: true},
    { id: 'chUserId', isOrder: true, numeric: false, disablePadding: true, label: '아이디' },
    { id: 'chUserName', isOrder: true, numeric: false, disablePadding: true, label: '사용자이름' },
    { id: 'chDeptNm', isOrder: true, numeric: false, disablePadding: true, label: '조직' },
    { id: 'chStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' }
    
  ];

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

  // componentWillReceiveProps(newProps) {
  //   const { stateData } = this.state;
  //   const newListParam = (stateData.get('listParam')).merge({
  //     deptCd: newProps.deptCd
  //   });
  //   this.handleGetUserList(newListParam);
  // }

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

  handleRowClick = (event, id) => {
    const { stateData } = this.state;
    const selectedIds = stateData.get('selectedIds');
    let newSelectedIds = null;
    if(selectedIds) {
        const indexNo = selectedIds.indexOf(id);
        if(indexNo > -1) {
          newSelectedIds = selectedIds.delete(indexNo);
        } else {
          newSelectedIds = selectedIds.push(id);
        }
    } else {
      newSelectedIds = List([id]);
    }
    this.setState({ stateData: stateData.set('selectedIds', newSelectedIds) });
    this.props.onSelectUser(newSelectedIds);
  };

  handleChangeUserStatusSelect = (value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      status: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    this.handleGetUserList(newListParam);
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
    //this.handleGetUserList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetUserList(newListParam);
  };


  isSelected = id => {
    const selectedIds = this.state.stateData.get('selectedIds');
    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
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
                  <UserStatusSelect onChangeSelect={this.handleChangeUserStatusSelect} />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth={true}>
                  <KeywordOption handleKeywordChange={this.handleKeywordChange} />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <Button size="small" variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />
                  조회
                </Button>
              </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <GrCommonTableHead
            classes={classes}
            keyId="userId"
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
              const isSelected = this.isSelected(n.get('userId'));
              return (
                <TableRow
                  className={classes.grNormalTableRow}
                  hover
                  onClick={event => this.handleRowClick(event, n.get('userId'))}
                  role="checkbox"
                  aria-checked={isSelected}
                  key={n.get('userId')}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                    <Checkbox checked={isSelected} className={classes.grObjInCell} />
                  </TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('userNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('status')}</TableCell>
                  {/* <TableCell className={classes.grSmallAndClickCell}>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleEditClick(event, n.get('userId'))}>
                      <BuildIcon />
                    </Button>
                    <Button color="secondary" size="small" 
                      className={classes.buttonInTableRow}
                      onClick={event => this.handleDeleteClick(event, n.get('userId'))}>
                      <DeleteIcon />
                    </Button>
                  </TableCell> */}
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

export default withStyles(GrCommonStyle)(UserListForSelect);

