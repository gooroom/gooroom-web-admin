import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from '../../modules/ClientManageModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../containers/GrContent/GrPageHeader";
import GrPane from '../../containers/GrContent/GrPane';

import ClientDialog from "./ClientDialog";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import Checkbox from "@material-ui/core/Checkbox";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

// option components
import ClientGroupSelect from '../Options/ClientGroupSelect';
import ClientStatusSelect from '../Options/ClientStatusSelect';


//
//  ## Theme override ########## ########## ########## ########## ########## 
//
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
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: "clientStatus", isOrder: true, numeric: false, disablePadding: true, label: "상태" },
    { id: "clientId", isOrder: true, numeric: false, disablePadding: true, label: "단말아이디" },
    { id: "clientSetup", isOrder: true, numeric: false, disablePadding: true, label: "#" },
    { id: "clientName", isOrder: true, numeric: false, disablePadding: true, label: "단말이름" },
    { id: "loginId", isOrder: true, numeric: false, disablePadding: true, label: "접속자" },
    {
      id: "clientGroupName", isOrder: true, 
      numeric: false,
      disablePadding: true,
      label: "단말그룹"
    },
    { id: "regDate", isOrder: true, numeric: false, disablePadding: true, label: "등록일" }
  ];

  render() {
    const {
      onSelectAllClick,
      orderDir,
      orderColumn,
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
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel active={orderColumn === column.id}
                            direction={orderDir}
                            onClick={this.createSortHandler(column.id)}
                         >{column.label}</TableSortLabel>
                } else {
                  return <p>{column.label}</p>
                }
              })()}
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
      // clientDialogOpen: false,
      // clientInfos: "",
      // selectedClientId: "",
      // selectedClientGroupId: "",

      // clientGroup: "",
      // clientGroupOptionList: [],
      // clientStatus: "",
      // clientStatusOptionList: [
      //   { id: "NORMAL", value: "NORMAL", label: "정상단말" },
      //   { id: "SECURE", value: "SECURE", label: "침해단말" },
      //   { id: "REVOKED", value: "REVOKED", label: "해지단말" },
      //   { id: "ONLINE", value: "ONLINE", label: "온라인" },
      //   { id: "ALL", value: "ALL", label: "전체" }
      // ],
      // keyword: "",

      // order: "asc",
      // orderBy: "calories",
      // selected: [],
      // data: [],
      // page: 0,
      // rowsPerPage: 10,
      // rowsTotal: 0,
      // rowsFiltered: 0
    };
  }

  componentDidMount() {

    // grRequestPromise("/gpms/readClientGroupList", {
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

    grRequestPromise("/gpms/readGrClientList", {
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
            clientGroupId: d.clientGroupId,
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

  handleInfoClick = (event, clientId, clientGroupId) => {

    event.stopPropagation();

    this.setState({
      clientDialogOpen: true,
      selectedClientId: clientId,
      selectedClientGroupId: clientGroupId,
    });

    // grRequestPromise("/gpms/readClientInfo", {
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

  // .................................................

  // Events...
  handleChangeSelect = event => {
    
    this.setState({ [event.target.name]: event.target.value });
  };

  // .................................................
  handleClientDialogClose = value => {
    this.setState({ 
      clientInfos: value, 
      clientDialogOpen: false 
    });
  };


  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................
  // .................................................

  isSelected = id => {
    
    const { ClientManageActions, ClientManageProps } = this.props;
    return ClientManageProps.selected.indexOf(id) !== -1;
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {page: page}));
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {rowsPerPage: event.target.value}));
  };

  handleSelectBtnClick = (param) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, param));
  };

  handleKeywordChange = name => event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedListParam(ClientManageProps.listParam, {keyword: event.target.value});
    ClientManageActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  };

  handleChangeGroupSelect = (event, property) => {
    console.log(' handleChangeGroupSelect : ', property);
  };
  handleChangeClientStatusSelect = (event, property) => {
    console.log(' handleChangeClientStatusSelect : ', property);
  };

  render() {

    //const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered } = this.state;
    const { ClientManageProps } = this.props;
    //const emptyRows = rowsPerPage - data.length;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;


    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>

          {/* data option area */}
          <form className={formClass}>
            <FormControl className={formControlClass} autoComplete="off">
              <InputLabel htmlFor="client-status">단말상태</InputLabel>
              <ClientGroupSelect 
                onChangeSelect={this.handleChangeGroupSelect}
              />
            </FormControl>

            <FormControl className={formControlClass} autoComplete="off">
              <InputLabel htmlFor="client-group">단말그룹</InputLabel>
              <ClientStatusSelect 
                onChangeSelect={this.handleChangeClientStatusSelect}
              />
            </FormControl>

            <FormControl className={formControlClass} autoComplete="off">
              <TextField
                id='keyword'
                label='검색어'
                className={textFieldClass}
                value={ClientManageProps.listParam.keyword}
                onChange={this.handleKeywordChange('keyword')}
                margin='dense'
              />
            </FormControl>

            <div className={formEmptyControlClass} />

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant="raised"
              color="primary"
              onClick={() => this.handleSelectBtnClick({page: 0})}
            >
              <Search className={leftIconClass} />
              조회
            </Button>
          </form>

            <div className={tableContainerClass}>
              <Table className={tableClass}>
                <ClientManageHead
                  numSelected={ClientManageProps.selected.length}
                  onSelectAllClick={this.handleSelectAllClick}
                  orderDir={ClientManageProps.listParam.orderDir}
                  orderColumn={ClientManageProps.listParam.orderColumn}
                  onRequestSort={this.handleRequestSort}
                  rowCount={ClientManageProps.listData.length}
                />
                <TableBody>
                  {ClientManageProps.listData
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
                          <TableCell className={tableCellClass} onClick={event => this.handleInfoClick(event, n.clientId, n.clientGroupId)}>
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
                        colSpan={ClientManageHead.columnData.length + 1}
                        className={tableCellClass}
                      />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <TablePagination
              component='div'
              count={ClientManageProps.listParam.rowsFiltered}
              rowsPerPage={ClientManageProps.listParam.rowsPerPage}
              rowsPerPageOptions={ClientManageProps.listParam.rowsPerPageOptions}
              page={ClientManageProps.listParam.page}
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
        <ClientDialog
          clientId={this.state.selectedClientId}
          clientGroupId={this.state.selectedClientGroupId}
          open={this.state.clientDialogOpen}
          onClose={this.handleClientDialogClose}
        />
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientManage);

