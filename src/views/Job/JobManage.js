import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from 'material-ui/styles';
import { css } from 'glamor';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "material-ui/Table";
import Checkbox from "material-ui/Checkbox";
import Tooltip from "material-ui/Tooltip";
import Dialog, { DialogTitle } from 'material-ui/Dialog';


import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from 'material-ui/Typography';
import blue from 'material-ui/colors/blue';

import GrPageHeader from "../../components/GrHeader/GrPageHeader";

import TextField from "material-ui/TextField";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // error: will us the default color
  },
});

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


class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
        <div>
          <List>
            {emails.map(email => (
              <ListItem button onClick={() => this.handleListItemClick(email)} key={email}>
                <ListItemAvatar>
                  <Avatar >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={email} />
              </ListItem>
            ))}
            <ListItem button onClick={() => this.handleListItemClick('addAccount')}>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="add account" />
            </ListItem>
          </List>
        </div>
      </Dialog>
    );
  }
}



class JobManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [

    { id: "jobNo", numeric: false, disablePadding: true, label: "작업번호" },
    { id: "jobName", numeric: false, disablePadding: true, label: "작업이름" },
    { id: "readyCount", numeric: false, disablePadding: true, label: "진행상태" },
    { id: "clientCount", numeric: false, disablePadding: true, label: "대상단말수" },
    { id: "errorCount", numeric: false, disablePadding: true, label: "작업오류수" },
    { id: "compCount", numeric: false, disablePadding: true, label: "작업완료수" },
    { id: "regUserId", numeric: false, disablePadding: true, label: "등록자" },
    { id: "regDate", numeric: false, disablePadding: true, label: "등록일" },
  ];

  static getColumnData() {
    return JobManageHead.columnData;
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
          {JobManageHead.columnData.map(column => {
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


class JobManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      detailOpen: false,
      selectedValue: "",

      jobStatus: "",
      jobStatusOptionList: [
        { id: "R", value: "R", label: "작업전" },
        { id: "D", value: "D", label: "작업중" },
        { id: "C", value: "C", label: "작업완료" },
        { id: "ALL", value: "ALL", label: "전체" }
      ],
      keyword: "",

      order: "asc",
      orderBy: "calories",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      rowsTotal: 0,
      rowsFiltered: 0
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    // todo:
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise("http://localhost:8080/gpms/readJobList", {
      searchKey: this.state.keyword,
      job_status: this.state.jobStatus,

      start: page * rowsPerPage,
      length: rowsPerPage,
      orderColumn: orderBy,
      orderDir: order,
    }).then(res => {
        const listData = [];
        res.data.forEach(d => {
          const obj = {
            jobStatus: d.jobStatus,
            clientId: d.clientId,
            clientName: d.clientName,
            loginId: d.loginId,
            clientGroupName: d.clientGroupName,
            regDate: d.regDate
          };
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

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.clientId) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleCellClick = (event, id) => {
    //event.preventDefault();
    event.stopPropagation();
    console.log("handleCellClick .. " + id);
    this.setState({
      detailOpen: true,
    });
  };

  handleClick = (event, id) => {
    //event.preventDefault();
    event.stopPropagation();
    console.log("handleClick .. " + id);
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
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
  handleChangeSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKeyword = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // .................................................
  handleDetailClose = value => {
    console.log("handleDetailClose...");
    this.setState({ selectedValue: value, detailOpen: false });
  };

  render() {

    const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered } = this.state;
    const emptyRows = rowsPerPage - data.length;

    console.log(JobManageHead.getColumnData().length);

    return (
      <React.Fragment>
        <Card >
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={pageContentClass}>
          
            <form className={formClass}>
              <FormControl className={formControlClass} autoComplete="off">
                <InputLabel htmlFor="job-status">작업상태</InputLabel>
                <Select
                  value={this.state.jobStatus}
                  onChange={this.handleChangeSelect}
                  inputProps={{ name: "jobStatus", id: "job-status" }}
                >
                  {this.state.jobStatusOptionList.map(x => (
                    <MenuItem value={x.value} key={x.id}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

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

              <div className={formEmptyControlClass} />

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
            </form>

            <div
              className={tableContainerClass}
            >
              <Table className={tableClass}>
                <JobManageHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {data
                    .map(n => {
                      const isSelected = this.isSelected(n.jobNo);
                      return (
                        <TableRow
                          className={tableRowClass}
                          hover
                          onClick={event => this.handleClick(event, n.jobNo)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.clientId}
                          selected={isSelected}
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
                            {n.regDate}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 32 * emptyRows }}>
                      <TableCell
                        colSpan={JobManageHead.getColumnData().length + 1}
                        className={tableCellClass}
                      />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              component="div"
              count={rowsFiltered}
              rowsPerPage={rowsPerPage}
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
          </CardContent>
        </Card>
        <SimpleDialog
        selectedValue={this.state.selectedValue}
        open={this.state.detailOpen}
        onClose={this.handleDetailClose}
        />
      </React.Fragment>
      
    );
  }
}

export default JobManage;