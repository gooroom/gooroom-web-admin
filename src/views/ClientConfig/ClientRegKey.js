import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from "material-ui/styles";
import { css } from "glamor";

import moment from "moment";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../containers/GrContent/GrPageHeader";

import ClientRegKeyDialog from "./ClientRegKeyDialog";
import GrPane from "../../containers/GrContent/GrPane";

import Typography from 'material-ui/Typography';
import Grid from "material-ui/Grid";

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
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientRegKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      clientRegKeyDialogOpen: false,
      userInfo: "",
      selectedUserId: "",

      columnData: [
        { id: "colRegKey", numeric: false, disablePadding: true, label: "단말등록키" },
        { id: "colValidDate", numeric: false, disablePadding: true, label: "유효날짜" },
        { id: "colExpireDate", numeric: false, disablePadding: true, label: "인증서만료날짜" },
        { id: "colModDate", numeric: false, disablePadding: true, label: "등록일" },
        { id: "colAction", numeric: false, disablePadding: true, label: "수정/삭제" },
      ],

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

    this.formatDateToSimple = this.formatDateToSimple.bind(this);
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise("http://localhost:8080/gpms/readRegKeyInfoList", {
      searchKey: this.state.keyword,

      start: page * rowsPerPage,
      length: rowsPerPage,
      orderColumn: orderBy,
      orderDir: order,
    }).then(res => {
        const listData = [];
        res.data.forEach(d => {
          d.validDate = this.formatDateToSimple(d.validDate, "YYYY-MM-DD");
          d.expireDate = this.formatDateToSimple(d.expireDate, "YYYY-MM-DD");
          d.modDate = this.formatDateToSimple(d.modDate, "YYYY-MM-DD HH:mm");
          //this.testFunction("aaaa");
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
    console.log("handleCellClick .. " + clientId);
    this.setState({
      clientDialogOpen: true,
      selectedClientId: clientId,
      selectedClientGroupId: clientGroupId,
    });

  };
  
  handleClick = (event, id) => {

    console.log("handleClick .. " + id);
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
      clientRegKeyInfo: value,
      clientRegKeyDialogOpen: false 
    });
  };

  showClientGroupDialog = value => {
    this.setState({
      clientRegKeyDialogOpen: true 
    });
  }


  formatDateToSimple = (value, format) => {
    try {
      const date = new Date(value);
      return moment(date).format(format);//date.toISOString().substring(0, 10);
    } catch (err) {
      console.log(err);
      return "";
    }
    console.log(value);
  }



  
  render() {

    const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.state;
    const emptyRows = rowsPerPage - data.length;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          {/* data option area */}
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
          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <TableHead>
                <TableRow>
                  {this.state.columnData.map(column => {
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
                          //onClick={this.handleRequestSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      </TableCell>
                    );
                  }, this)}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map(n => {
                  const isSelected = this.isSelected(n.userId);
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleClick(event, n.regkeyNo)}
                      tabIndex={-1}
                      key={n.regkeyNo}
                      selected={isSelected}
                    >
                      <TableCell className={tableCellClass}>
                        {n.regkeyNo}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.validDate}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.expireDate}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.modDate}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.modDate}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={this.state.columnData.length + 1}
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
        </GrPane>
        {/* dialog(popup) component area */}
        <ClientRegKeyDialog 
          open={this.state.clientRegKeyDialogOpen}
          onClose={this.handleUserDialogClose}
        />

      </React.Fragment>
    );
  }
}

export default ClientRegKey;
