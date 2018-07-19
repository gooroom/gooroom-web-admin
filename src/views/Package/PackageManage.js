import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { css } from "glamor";

import { grLayout } from "/templates/default/GrLayout";
import { grColor } from "/templates/default/GrColors";
import { grRequestPromise } from "/components/GrUtils/GrRequester";

import GrPageHeader from "/containers/GrContent/GrPageHeader";

import GrTreeList from "/components/GrTree/GrTreeList";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "@material-ui/core/Card";

//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const listItems = [{title: "one"}];



class PackageManage extends Component {

  constructor(props) {
    super(props);
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
      </React.Fragment>
      
    );
  }


}

export default PackageManage;
