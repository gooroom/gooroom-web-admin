import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

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

import GrOptions from "../../containers/GrOptions";
import GrPageHeader from "../../components/GrHeader/GrPageHeader";
import { GrProps, GrGridColumns, GrGridData } from "./ClientManageProp";

import axios from "axios";
import qs from "qs";

import ReactTable from "react-table";
import "react-table/react-table.css";

import TextField from "material-ui/TextField";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";

const styles = theme => ({
  content: {
    height: "100%"
  },
  pageContent: {
    paddingTop: 14
  },

  form: {
    marginBottom: 6,
    display: "flex"
  },
  formControl: {
    minWidth: 100,
    marginRight: "15px",
    flexGrow: 1
  },
  formEmptyControl: {
    flexGrow: "6"
  },

  textField: {
    marginTop: 3
  },

  table: {
    minWidth: 700
  },

  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },

  tableHeadCell: {
    whiteSpace: "nowrap",
    padding: 0
  },
  tableContainer: {
    overflowX: "auto"
  },
  tableRow: {
    height: "2em"
  },
  tableCell: {
    height: "1em",
    padding: 0,
    cursor: "pointer"
  }
});

const columnData = [
  { id: "clientStatus", numeric: false, disablePadding: true, label: "상태" },
  { id: "clientId", numeric: false, disablePadding: true, label: "단말아이디" },
  { id: "clientName", numeric: false, disablePadding: true, label: "단말이름" },
  { id: "loginId", numeric: false, disablePadding: true, label: "접속자" },
  {
    id: "clientGroupName",
    numeric: false,
    disablePadding: true,
    label: "단말그룹"
  },
  { id: "regDate", numeric: false, disablePadding: true, label: "등록일" }
];

class ClientManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { classes } = this.props;
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
          <TableCell padding="checkbox" className={classes.tableHeadCell}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                className={classes.tableHeadCell}
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

ClientManageHead.propTypes = {
  classes: PropTypes.object.isRequired
};
ClientManageHead = withStyles(styles)(ClientManageHead);


const requestData = (param) => {

  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: param.url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [
        function(data, headers) {
          return qs.stringify(data);
        }
      ],
      data: param,
      withCredentials: true
    }).then(function(response) {

        if (response.data.status.result === "success" && response.data.data && response.data.data.length > 0) {

            // const listData = [];
            // response.data.data.forEach(d => {
            //   const obj = {
            //     clientStatus: d.clientStatus,
            //     clientId: d.clientId,
            //     clientName: d.clientName,
            //     loginId: d.loginId,
            //     clientGroupName: d.clientGroupName,
            //     regDate: d.regDate
            //   };
            //   listData.push(obj);
            // });

            // const res = {
            //   rows: listData,
            //   rowsTotal: response.data.recordsTotal,
            //   rowsFiltered: response.data.recordsFiltered,
            //   page: response.data.draw,
            // };
            // resolve(res);

            resolve(response.data);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  });
};



class ClientManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,

      clientGroup: "",
      clientGroupOptionList: [],
      clientStatus: "",
      clientStatusOptionList: [
        { id: "NORMAL", value: "NORMAL", label: "정상단말" },
        { id: "SECURE", value: "SECURE", label: "침해단말" },
        { id: "REVOKED", value: "REVOKED", label: "해지단말" },
        { id: "ONLINE", value: "ONLINE", label: "온라인" },
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
    var that = this;
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientGroupList",
      transformRequest: [
        function(data, headers) {
          return "";
        }
      ],
      data: {},
      withCredentials: true
    })
      .then(function(response) {
        if (response.data.data && response.data.data.length > 0) {
          const groupList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpId,
            label: x.grpNm
          }));
          that.setState({ clientGroupOptionList: groupList });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    requestData({
      url: "http://localhost:8080/gpms/readGrClientList",

      searchKey: this.state.keyword,
      clientType: this.state.clientStatus,
      groupId: this.state.clientGroup,

      start: page * rowsPerPage,
      length: rowsPerPage,
      orderColumn: orderBy,
      orderDir: order,
    }).then(res => {
      
      const listData = [];
      res.data.forEach(d => {
        const obj = {
          clientStatus: d.clientStatus,
          clientId: d.clientId,
          clientName: d.clientName,
          loginId: d.loginId,
          clientGroupName: d.clientGroupName,
          regDate: d.regDate
        };
        listData.push(obj);
      });

      this.setState({
        data: listData,
        loading: false,
        rowsTotal: parseInt(res.recordsTotal, 10),
        rowsFiltered: parseInt(res.recordsFiltered, 10),
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

  handleClick = (event, id) => {
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

  render() {
    const { classes } = this.props;
    const {
      clientGroup,
      clientStatus,
      keyword,
      loading
    } = this.state;
    const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered } = this.state;

    const emptyRows = rowsPerPage - data.length;

    return (
      <div className={classes.root}>
        <Card className={classes.content}>
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={classes.pageContent}>
            <form className={classes.form}>
              <FormControl className={classes.formControl} autoComplete="off">
                <InputLabel htmlFor="client-status">단말상태</InputLabel>
                <Select
                  value={this.state.clientStatus}
                  onChange={this.handleChangeSelect}
                  inputProps={{ name: "clientStatus", id: "client-status" }}
                >
                  {this.state.clientStatusOptionList.map(x => (
                    <MenuItem value={x.value} key={x.id}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} autoComplete="off">
                <InputLabel htmlFor="client-group">단말그룹</InputLabel>
                <Select
                  value={this.state.clientGroup}
                  onChange={this.handleChangeSelect}
                  inputProps={{ name: "clientGroup", id: "client-group" }}
                >
                  {this.state.clientGroupOptionList.map(x => (
                    <MenuItem value={x.value} key={x.id}>
                      {x.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} autoComplete="off">
                <TextField
                  id="keyword"
                  label="검색어"
                  className={classes.textField}
                  value={this.state.keyword}
                  onChange={this.handleChangeKeyword("keyword")}
                  margin="dense"
                />
              </FormControl>

              <div className={classes.formEmptyControl} />

              <Button
                className={classNames(classes.button, classes.formControl)}
                variant="raised"
                color="primary"
                onClick={() => {
                  this.fetchData(0, this.state.rowsPerPage, this.state.orderBy, this.state.order);
                }}
              >
                <Search className={classes.leftIcon} />
                조회
              </Button>
            </form>

            <div
              className={classNames(
                classes.tableWrapper,
                classes.tableContainer
              )}
            >
              <Table className={classes.table}>
                <ClientManageHead
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
                      const isSelected = this.isSelected(n.clientId);
                      return (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          onClick={event => this.handleClick(event, n.clientId)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.clientId}
                          selected={isSelected}
                        >
                          <TableCell
                            padding="checkbox"
                            className={classes.tableCell}
                          >
                            <Checkbox
                              checked={isSelected}
                              className={classes.tableCell}
                            />
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.clientStatus}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.clientId}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.clientName}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.loginId}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.clientGroupName}
                          </TableCell>
                          <TableCell className={classes.tableCell}>
                            {n.regDate}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 32 * emptyRows }}>
                      <TableCell
                        colSpan={7}
                        className={classes.tableCell}
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
      </div>
    );
  }
}

ClientManage.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ClientManage);
