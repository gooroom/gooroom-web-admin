import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as JobManageActions from 'modules/JobManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrConfirm from 'components/GrComponents/GrConfirm';
import GrPane from 'containers/GrContent/GrPane';

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
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

import JobInform from './JobInform';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class JobManage extends Component {

  columnHeaders = [
    { id: "chJobNo", isOrder: true, numeric: false, disablePadding: true, label: "작업번호" },
    { id: "chJobName", isOrder: true, numeric: false, disablePadding: true, label: "작업이름" },
    { id: "chReadyCount", isOrder: true, numeric: false, disablePadding: true, label: "진행상태" },
    { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: "대상단말수" },
    { id: "chErrorCount", isOrder: true, numeric: false, disablePadding: true, label: "작업오류수" },
    { id: "chCompCount", isOrder: true, numeric: false, disablePadding: true, label: "작업완료수" },
    { id: "chRegUserId", isOrder: true, numeric: false, disablePadding: true, label: "등록자" },
    { id: "chRegDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" },
  ];

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }


  // .................................................
  handleSelectBtnClick = () => {
    const { JobManageActions, jobManageModule } = this.props;
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, {
      page: 0,
      compId: ''
    }));
  };

  handleRowClick = (event, id) => {
    const selectedViewItem = this.props.jobManageModule.listData.find(function(element) {
      return element.jobNo == id;
    });

    this.props.JobManageActions.showJobInform({
      selectedViewItem: selectedViewItem,
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
    JobManageActions.readJobManageList(getMergedObject(jobManageModule.listParam, {rowsPerPage: event.target.value, page: 0}));
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
    const { classes } = this.props;
    const { jobManageModule, grConfirmModule } = this.props;
    const emptyRows = jobManageModule.listParam.rowsPerPage - jobManageModule.listData.length;

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
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
              </Grid>

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={jobManageModule.listParam.keyword}
                  onChange={this.handleKeywordChange('keyword')}
                />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={ () => this.handleSelectBtnClick() }
                >
                  <Search />
                  조회
                </Button>

              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleCreateButton();
                }}
              >
                <AddIcon />
                등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          <div>
            <Table>
            
              <GrCommonTableHead
                classes={classes}
                orderDir={jobManageModule.listParam.orderDir}
                orderColumn={jobManageModule.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
                columnData={this.columnHeaders}
              />
              <TableBody>
                {jobManageModule.listData.map(n => {
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.jobNo)}
                      key={n.jobNo}
                    >
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.jobNo}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.jobName}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.readyCount}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.clientCount}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.errorCount}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.compCount}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {n.regUserId}
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
                      </TableCell>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(JobManage));

