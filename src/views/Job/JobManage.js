import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as JobManageActions from 'modules/JobManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrConfirm from 'components/GrComponents/GrConfirm';
import GrPane from 'containers/GrContent/GrPane';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Search from '@material-ui/icons/Search';


import JobInform from './JobInform';




const theme = createMuiTheme();

const contentClass = css({
  height: "200% !important"
}).toString();

const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const formClass = css({
  marginBottom: "6px !important",
  display: "flex"
}).toString();

const formControlClass = css({
  minWidth: "100px !important",
    marginRight: "15px !important",
    flexGrow: 1
}).toString();

const formEmptyControlClass = css({
  flexGrow: "6 !important"
}).toString();

const textFieldClass = css({
  marginTop: "3px !important"
}).toString();

const buttonClass = css({
  margin: theme.spacing.unit + " !important"
}).toString();

const leftIconClass = css({
  marginRight: theme.spacing.unit + " !important"
}).toString();


const tableClass = css({
  minWidth: "700px !important"
}).toString();

const tableHeadCellClass = css({
  whiteSpace: "nowrap",
  padding: "0px !important"
}).toString();

const tableContainerClass = css({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    height: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const tableRowClass = css({
  height: "2em !important"
}).toString();

const tableCellClass = css({
  height: "1em !important",
  padding: "0px !important",
  cursor: "pointer"
}).toString();



//
//  ## Header ########## ########## ########## ########## ########## 
//
class JobManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "chJobNo", isOrder: true, numeric: false, disablePadding: true, label: "작업번호" },
    { id: "chJobName", isOrder: true, numeric: false, disablePadding: true, label: "작업이름" },
    { id: "chReadyCount", isOrder: true, numeric: false, disablePadding: true, label: "진행상태" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "대상단말수" },
    { id: "chErrorCount", isOrder: true, numeric: false, disablePadding: true, label: "작업오류수" },
    { id: "chCompCount", isOrder: true, numeric: false, disablePadding: true, label: "작업완료수" },
    { id: "chRegUserId", isOrder: true, numeric: false, disablePadding: true, label: "등록자" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
  ];

  render() {
    const {
      orderDir,
      orderColumn,
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {JobManageHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(column.isOrder) &&
                <TableSortLabel
                  active={orderColumn === column.id}
                  direction={orderDir}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              }
              {(!column.isOrder) &&
                <p>{column.label}</p>
              }
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

//
//  ## Content ########## ########## ########## ########## ########## 
//
class JobManage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { JobManageActions, jobManageModule } = this.props;
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, param));
  };

  handleRowClick = (event, id) => {
    const selectedItem = this.props.jobManageModule.listData.find(function(element) {
      return element.jobNo == id;
    });

    this.props.JobManageActions.showJobInform({
      selectedItem: selectedItem,
    });
  };

  
  // 페이지 번호 변경
  handleChangePage = (event, page) => {

    const { JobManageActions, jobManageModule } = this.props;
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = (event) => {

    const { JobManageActions, jobManageModule } = this.props;
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, {rowsPerPage: event.target.value}));
  };

  // .................................................
  handleRequestSort = (event, property) => {

    const { jobManageModule, JobManageActions } = this.props;
    let orderDir = "desc";
    if (jobManageModule.listParam.orderColumn === property && jobManageModule.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, {orderColumn: property, orderDir: orderDir}));
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  // .................................................

  // Events...
  handleStatusChange = event => {

    const { JobManageActions, jobManageModule } = this.props;
    const paramName = event.target.name;
    const newParam = getMergedObject(jobManageModule.listParam, {[paramName]: event.target.value});
    JobManageActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  };

  handleKeywordChange = name => event => {

    const { JobManageActions, jobManageModule } = this.props;
    const newParam = getMergedObject(jobManageModule.listParam, {keyword: event.target.value});
    JobManageActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }



  render() {

    const { jobManageModule, grConfirmModule } = this.props;
    const emptyRows = jobManageModule.listParam.rowsPerPage - jobManageModule.listData.length;

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          {/* data option area */}
          <form className={formClass}>
            <FormControl className={formControlClass} autoComplete="off">
              <InputLabel htmlFor="job-status">작업상태</InputLabel>
              <Select
                value={jobManageModule.listParam.jobStatus}
                onChange={this.handleStatusChange}
                inputProps={{ name: "jobStatus", id: "job-status" }}
              >
              {jobManageModule.jobStatusOptionList.map(x => (
              <MenuItem value={x.value} key={x.id}>
                {x.label}
              </MenuItem>
              ))}
              </Select>
            </FormControl>
            <FormControl className={formControlClass} autoComplete='off'>
              <TextField
                id='keyword'
                label='검색어'
                className={textFieldClass}
                value={jobManageModule.listParam.keyword}
                onChange={this.handleKeywordChange('keyword')}
                margin='dense'
              />
            </FormControl>
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='primary'
              onClick={() => this.handleSelectBtnClick({page: 0})}
            >
              <Search className={leftIconClass} />
              조회
            </Button>
            <div className={formEmptyControlClass} />

          </form>
          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <JobManageHead
                orderDir={jobManageModule.listParam.orderDir}
                orderColumn={jobManageModule.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {jobManageModule.listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.jobNo)}
                      key={n.jobNo}
                    >
                      <TableCell className={tableCellClass}>
                        {n.jobNo}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.jobName}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.readyCount}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.clientCount}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.errorCount}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.compCount}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.regUserId}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={JobManageHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={jobManageModule.listParam.rowsFiltered}
            rowsPerPage={jobManageModule.listParam.rowsPerPage}
            page={jobManageModule.listParam.page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />

        </GrPane>
        <JobInform />
        <GrConfirm
          open={grConfirmModule.confirmOpen}
          confirmTitle={grConfirmModule.confirmTitle}
          confirmMsg={grConfirmModule.confirmMsg}
        />
      </React.Fragment>
      
    );
  }
}


const mapStateToProps = (state) => ({

  jobManageModule: state.JobManageModule,
  grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  JobManageActions: bindActionCreators(JobManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(JobManage);

