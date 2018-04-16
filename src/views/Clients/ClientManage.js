import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from 'material-ui/styles';
import { css } from 'glamor';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../components/GrHeader/GrPageHeader";

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
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';

import TextField from "material-ui/TextField";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl, FormHelperText } from "material-ui/Form";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";



//
//  ## Temporary ########## ########## ########## ########## ########## 
//
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from 'material-ui/Typography';

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
//  ## Dialog ########## ########## ########## ########## ########## 
//
class SimpleDialog extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { onClose, selectedValue, ...other } = this.props;
    const clientInfo = {};

    console.log("SimpleDialog... render");

    grRequestPromise("http://localhost:8080/gpms/readClientInfo", {
    }).then(res => {
        const clientInfo = res.data.map(x => ({
          key: x.grpId,
          id: x.grpId,
          value: x.grpId,
          label: x.grpNm
        }));
    });

    return (
      <Dialog disableBackdropClick={true} onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
        <DialogTitle id="simple-dialog-title">단말 정보</DialogTitle>

        <div>
        <Typography >{selectedValue}</Typography>
        <Typography >I am an expansion panel</Typography>
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
        <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
      </Dialog>
    );
  }
}


//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "clientStatus", numeric: false, disablePadding: true, label: "상태" },
    { id: "clientId", numeric: false, disablePadding: true, label: "단말아이디" },
    { id: "clientSetup", numeric: false, disablePadding: true, label: "#" },
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

  static getColumnData() {
    return ClientManageHead.columnData;
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
          <TableCell padding="checkbox" className={tableHeadCellClass}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount && rowCount > 0}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {ClientManageHead.columnData.map(column => {
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
class ClientManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      detailOpen: false,
      selectedValue: "",

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

    grRequestPromise("http://localhost:8080/gpms/readClientGroupList", {
    }).then(res => {
        const groupList = res.data.map(x => ({
          key: x.grpId,
          id: x.grpId,
          value: x.grpId,
          label: x.grpNm
        }));
        this.setState({ 
          clientGroupOptionList: groupList,
          selected: []
        });
    });
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise("http://localhost:8080/gpms/readGrClientList", {
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
      selectedValue: id
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

    return (
      <React.Fragment>
        <Card>
          <GrPageHeader path={this.props.location.pathname} />
          <CardContent className={pageContentClass}>
          
            <form className={formClass}>
              <FormControl className={formControlClass} autoComplete="off">
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

              <FormControl className={formControlClass} autoComplete="off">
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

            <div className={tableContainerClass}>
              <Table className={tableClass}>
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
                          className={tableRowClass}
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
                            className={tableCellClass}
                          >
                            <Checkbox
                              checked={isSelected}
                              className={tableCellClass}
                            />
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientStatus}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientId}
                          </TableCell>
                          <TableCell className={tableCellClass} onClick={event => this.handleCellClick(event, n.clientId)}>
                            #
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientName}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.loginId}
                          </TableCell>
                          <TableCell className={tableCellClass}>
                            {n.clientGroupName}
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
                        colSpan={ClientManageHead.getColumnData().length + 1}
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

export default ClientManage;
