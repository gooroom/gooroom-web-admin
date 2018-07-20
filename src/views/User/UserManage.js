import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import { grLayout } from "templates/default/GrLayout";
import { grColor } from "templates/default/GrColors";
import { grRequestPromise } from "components/GrUtils/GrRequester";
import GrPageHeader from "containers/GrContent/GrPageHeader";

import UserManageDialog from "views/User/UserManageDialog";
import GrPane from "containers/GrContent/GrPane";

import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";
import Add from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";
//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ##########
//
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
class UserManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "userId", numeric: false, disablePadding: true, label: "아이디" },
    { id: "userNm", numeric: false, disablePadding: true, label: "사용자이름" },
    { id: "status", numeric: false, disablePadding: true, label: "상태" },
    { id: "lastLoginDt", numeric: false, disablePadding: true, label: "최근로그인날짜" },
    { id: "regDate", numeric: false, disablePadding: true, label: "등록일" }
  ];

  static getColumnData() {
    return UserManageHead.columnData;
  }

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    return (
      <TableHead>
        <TableRow>
        <TableCell padding="checkbox" className={tableHeadCellClass} >
            <Checkbox
            />
          </TableCell>
          {UserManageHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
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
class UserManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      userDialogOpen: false,
      userInfo: "",
      selectedUserId: "",

      keyword: "",

      order: "asc",
      orderBy: "calories",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
      rowsTotal: 0,
      rowsFiltered: 0

    }
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise("readUserList", {
      searchKey: this.state.keyword,

      start: page * rowsPerPage,
      length: rowsPerPage,
      orderColumn: orderBy,
      orderDir: order,
    }).then(res => {
        const listData = [];
        res.data.forEach(d => {
          listData.push(d);
        });
        this.setState({
          data: listData,
          selected: [],
          loading: false,
          rowsTotal: parseInt(res.recordsTotal, 10),
          rowsFiltered: parseInt(res.recordsFiltered, 10),
        });
    }, res => {
      this.setState({
        data: [],
        selected: [],
        loading: false,
        rowsTotal: 0,
        rowsFiltered: 0,
      });
    });
  }


  


  // .................................................
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.fetchData(this.state.page, this.state.rowsPerPage, orderBy, order);
  };
  
  handleInfoClick = (event, clientId, clientGroupId) => {

    event.stopPropagation();
    this.setState({
      clientDialogOpen: true,
      selectedClientId: clientId,
      selectedClientGroupId: clientGroupId,
    });

  };
  
  handleClick = (event, id) => {

    this.setState({ 
      selectedUserId: id
    });

  };

  handleChangePage = (event, page) => {
    this.fetchData(page, this.state.rowsPerPage, this.state.orderBy, this.state.order);
  };

  handleChangeRowsPerPage = event => {
    this.fetchData(this.state.page, event.target.value, this.state.orderBy, this.state.order);
  };
  
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  // .................................................

  // Events...
  handleChangeKeyword = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // .................................................
  handleUserDialogClose = value => {
    this.setState({ 
      clientGroupInfo: value, 
      clientGroupDialogOpen: false 
    });
  };

  showClientGroupDialog = value => {
    this.setState({
      clientGroupDialogOpen: true 
    });
  }

  
  render() {

    const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.state;
    const emptyRows = rowsPerPage - data.length;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          <form className={formClass}>
            <FormControl className={formControlClass} autoComplete="off">
              <TextField
                id="keyword"
                label="검색어"
                className={textFieldClass}
                value={this.state.keyword}
                onChange={this.handleChangeKeyword("keyword")}
                margin="dense"
              />
            </FormControl>
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant="raised"
              color="primary"
              onClick={() => {
                this.fetchData(0, this.state.rowsPerPage, this.state.orderBy, this.state.order);
              }}
            >
              <Search className={leftIconClass} />
              조회
            </Button>

            <div className={formEmptyControlClass} />

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant="raised"
              color="secondary"
              onClick={() => {
                this.showClientGroupDialog();
              }}
            >
              <Add className={leftIconClass} />
              등록
            </Button>
          </form>

          <div className={tableContainerClass}>
            <Table className={tableClass}>
              <UserManageHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
          {data.map(n => {
              const isSelected = this.isSelected(n.userId);
              return (
                <TableRow
                  className={tableRowClass}
                  hover
                  onClick={event => this.handleClick(event, n.userId)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n.userId}
                  selected={isSelected}
                >
                <TableCell
                  padding="checkbox"
                  className={tableCellClass}
                >
                <Checkbox
                    className={tableCellClass}
                  />
                </TableCell>
                  <TableCell className={tableCellClass}>
                    {n.userId}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {n.userNm}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {n.status}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {formatDateToSimple(n.lastLoginDt, 'YYYY-MM-DD')}                    
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
                colSpan={UserManageHead.getColumnData().length + 1}
                className={tableCellClass}
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    <TablePagination
      component="div"
      count="462"
      rowsPerPage="10"
      page={page}
      backIconButtonProps={{
        "aria-label": "Previous Page"
      }}
      nextIconButtonProps={{
        "aria-label": "Next Page"
      }}
      onChangePage={this.handleChangePage}
      onChangeRowsPerPage={this.handleChangeRowsPerPage}
    />



        </GrPane>

        <UserManageDialog 
          open={this.state.userDialogOpen}
          onClose={this.handleUserDialogClose}
        />

      </React.Fragment>
    );
  }
}

export default UserManage;
