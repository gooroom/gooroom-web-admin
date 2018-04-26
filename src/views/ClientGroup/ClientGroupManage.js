import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from 'material-ui/styles';
import { css } from 'glamor';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../components/GrHeader/GrPageHeader";

import ClientGroupDialog from "../ClientGroup/ClientGroupDialog";

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

import TextField from "material-ui/TextField";
import { FormControl, FormHelperText } from "material-ui/Form";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";
import Add from "@material-ui/icons/Add";



//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ########## 
//
const contentClass = css({
  height: "100% !important"
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
class ClientGroupManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "grpNm", numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "clientCount", numeric: false, disablePadding: true, label: "단말수" },
    { id: "desktopConfigNm", numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "clientConfigNm", numeric: false, disablePadding: true, label: "단말정책" },
    { id: "regDate", numeric: false, disablePadding: true, label: "등록일" }
  ];

  static getColumnData() {
    return ClientGroupManageHead.columnData;
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
          {ClientGroupManageHead.columnData.map(column => {
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
class ClientGroupManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      clientGroupDialogOpen: false,
      clientGroupInfo: "",
      selectedClientId: "",
      selectedClientGroupId: "",

      keyword: "",

      order: "asc",
      orderBy: "calories",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
      rowsTotal: 0,
      rowsFiltered: 0
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {

    // grRequestPromise("http://localhost:8080/gpms/readClientGroupList", {
    // }).then(res => {
    //     const groupList = res.data.map(x => ({
    //       key: x.grpId,
    //       id: x.grpId,
    //       value: x.grpId,
    //       label: x.grpNm
    //     }));
    //     this.setState({ 
    //       clientGroupOptionList: groupList,
    //       selected: []
    //     });
    // });
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise("http://localhost:8080/gpms/readClientGroupList", {
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

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.grpId) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleInfoClick = (event, clientId, clientGroupId) => {

    event.stopPropagation();
    console.log("handleCellClick .. " + clientId);
    this.setState({
      clientDialogOpen: true,
      selectedClientId: clientId,
      selectedClientGroupId: clientGroupId,
    });

    // grRequestPromise("http://localhost:8080/gpms/readClientInfo", {
    //   clientId: id
    // }).then(res => {
    //     const clientInfos = res.data;
    //     this.setState({
    //       clientDialogOpen: true,
    //       clientInfos: clientInfos
    //     });
    // });
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
  handleChangeKeyword = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // .................................................
  handleClientGroupDialogClose = value => {
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
        <Card>
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={pageContentClass}>
          
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
                <ClientGroupManageHead
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
                      const isSelected = this.isSelected(n.grpId);
                      return (
                        <TableRow
                          className={tableRowClass}
                          hover
                          onClick={event => this.handleClick(event, n.grpId)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={n.grpId}
                          selected={isSelected}
                        >
                          <TableCell className={tableCellClass}>
                            {n.grpNm}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientCount}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.desktopConfigNm}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientConfigNm}
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
                        colSpan={ClientGroupManageHead.getColumnData().length + 1}
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
        <ClientGroupDialog 
          open={this.state.clientGroupDialogOpen}
          onClose={this.handleClientGroupDialogClose}
        />
      </React.Fragment>
      
    );
  }
}

export default ClientGroupManage;
