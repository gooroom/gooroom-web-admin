import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';
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
  TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import Tooltip from 'material-ui/Tooltip';

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
    paddingTop: 2
  },
  control: {
    marginTop: 0
  },
  formControl: {
    minWidth: 120,
    marginRight: "15px"
  },
  form: {
    marginBottom: 15
  },

  table: {
    minWidth: 700,
  },

  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },

  headCell: {
    whiteSpace: "nowrap"
  },
  tableContainer: {
    overflowX: "auto"
  },
});


let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const columnData = [
  { id: 'ischeck', numeric: false, disablePadding: true, label: '선택' },
  { id: 'clientStatus', numeric: true, disablePadding: false, label: '상태' },
  { id: 'clientId', numeric: true, disablePadding: false, label: '단말아이디' },
  { id: 'clientName', numeric: true, disablePadding: false, label: '단말이름' },
  { id: 'loginId', numeric: true, disablePadding: false, label: '접속자' },
  { id: 'clientGroupName', numeric: true, disablePadding: false, label: '단말그룹' },
  { id: 'regDate', numeric: true, disablePadding: false, label: '등록일' },
];

const data = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 24, 4.0),
  createData('Eclair', 262, 16.0, 24, 6.0, 24, 4.0),
  createData('Cupcake', 305, 3.7, 67, 4.3, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 24, 4.0),
];

class ClientManageHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { classes } = this.props;

    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={classes.headCell}>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                className={classes.headCell}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

ClientManageHead.propTypes = {
  classes: PropTypes.object.isRequired,
};

ClientManageHead = withStyles(styles)(ClientManageHead);


























class ClientManage extends Component {

  
  constructor(props) {
    super(props);

    this.state = {

      collapse: true,
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

      clientListData: [],



      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [
        createData('Cupcake', 305, 3.7, 67, 4.3, 67, 4.3),
        createData('Donut', 452, 25.0, 51, 4.9, 67, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0, 67, 4.3),
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9, 67, 4.3),
        createData('Honeycomb', 408, 3.2, 87, 6.5, 67, 4.3),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 67, 4.3),
        createData('Jelly Bean', 375, 0.0, 94, 0.0, 67, 4.3),
        createData('KitKat', 518, 26.0, 65, 7.0, 67, 4.3),
        createData('Lollipop', 392, 0.2, 98, 0.0, 67, 4.3),
        createData('Marshmallow', 318, 0, 81, 2.0, 67, 4.3),
        createData('Nougat', 360, 19.0, 9, 37.0, 67, 4.3),
        createData('Oreo', 437, 18.0, 63, 4.0, 67, 4.3),
      ].sort((a, b) => (a.calories < b.calories ? -1 : 1)),
      page: 0,
      rowsPerPage: 5,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {

      var that = this;
      axios({
        method: "post",
        url: "http://localhost:8080/gpms/readClientGroupList",
        transformRequest: [function (data, headers) {
          return "";
        }],
        data: {
        },
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

    //this.getClientData();
  }

  fetchData(state, instance) {

    this.setState({
      loading: true,
      pageSize: state.pageSize
    });
    const that = this;
    axios({
      method: "post",
      url: "http://localhost:8080/gpms/readClientList",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      transformRequest: [function (data, headers) {
        return qs.stringify(data);
      }],
      data: {
        start: "0",
        length: state.pageSize,
        searchKey: that.state.keyword,
        clientType: that.state.clientStatus,
        groupId: that.state.clientGroup,
      },
      withCredentials: true
    }).then(function(response) {

        that.setState({ loading: false });

        if (response.data.data && response.data.data.length > 0) {
          const gridList = response.data.data.map(x => ({
            key: x.grpId,
            id: x.grpId,
            value: x.grpNm
          }));


          //const gridList2 = response.data.data;
          that.setState({ clientListData: response.data.data });
        }

      })
      .catch(function(error) {
        console.log(error);
      });
  }

  // .................................................
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map(n => n.id) });
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
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  // .................................................




  // Events...
  handleChangeSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKeyword = name => event => {
    this.setState({[name]: event.target.value});
  };

  render() {
    const { classes } = this.props;
    const { clientListData, clientGroup, clientStatus, keyword, pages, loading } = this.state;

    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

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
                  margin="normal"
                />
              </FormControl>

              <Button
                className={classes.button}
                variant="raised"
                color="primary"
                onClick={() => {
                  this.fetchData();
                }}
              >
                <Search className={classes.leftIcon} />
                조회
              </Button>
            </form>

    <div className={classNames(classes.tableWrapper, classes.tableContainer)}>
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
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                const isSelected = this.isSelected(n.id);
                return (
                  <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.name}</TableCell>
                    <TableCell numeric>{n.calories}</TableCell>
                    <TableCell numeric>{n.fat}</TableCell>
                    <TableCell numeric>{n.carbs}</TableCell>
                    <TableCell numeric>{n.protein}</TableCell>
                    <TableCell numeric>{n.carbs}</TableCell>
                    <TableCell numeric>{n.protein}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
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
