import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from '../../modules/ClientGroupModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../containers/GrContent/GrPageHeader";

import GrPane from '../../containers/GrContent/GrPane';
import GrConfirm from '../../components/GrComponents/GrConfirm';
import ClientGroupDialog from "../ClientGroup/ClientGroupDialog";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import Button from "@material-ui/core/Button";
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
    { id: "chGrpNm", numeric: false, disablePadding: true, label: "그룹이름" },
    { id: "chClientCount", numeric: false, disablePadding: true, label: "단말수" },
    { id: "chDesktopConfigNm", numeric: false, disablePadding: true, label: "데스크톱환경" },
    { id: "chClientConfigNm", numeric: false, disablePadding: true, label: "단말정책" },
    { id: "chRegDate", numeric: false, disablePadding: true, label: "등록일" }
  ];

  static getColumnData() {
    return ClientGroupManageHead.columnData;
  }

  render() {
    const {
      orderDir,
      orderColumn,
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
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
                <TableSortLabel
                  active={orderColumn === column.id}
                  direction={orderDir}
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
      // clientGroupDialogOpen: false,
      // clientGroupInfo: "",
      // selectedClientId: "",
      // selectedClientGroupId: "",

      // keyword: "",

      // order: "asc",
      // orderBy: "calories",
      // selected: [],
      // data: [],
      // page: 0,
      // rowsPerPage: 5,
      // rowsTotal: 0,
      // rowsFiltered: 0
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {

    // grRequestPromise("https://gpms.gooroom.kr/gpms/readClientGroupList", {
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

    grRequestPromise("/gpms/readClientGroupList", {
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
    const { ClientGroupActions, clientGroupModule } = this.props;
    let orderDir = "desc";
    if (clientGroupModule.listParam.orderColumn === property && clientGroupModule.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientGroupActions.readClientGroupList(getMergedListParam(clientGroupModule.listParam, {orderColumn: property, orderDir: orderDir}));
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

    // grRequestPromise("https://gpms.gooroom.kr/gpms/readClientInfo", {
    //   clientId: id
    // }).then(res => {
    //     const clientInfos = res.data;
    //     this.setState({
    //       clientDialogOpen: true,
    //       clientInfos: clientInfos
    //     });
    // });
  };

  handleRowClick = (event, id) => {
    const { clientGroupModule, ClientGroupActions } = this.props;

    const selectedItem = clientGroupModule.listData.find(function(element) {
      return element.grpNo == id;
    });

    console.log("handleRowClick .. selectedItem: ", selectedItem);

    ClientGroupActions.showClientGroupInform({
      selectedItem: selectedItem,
    });
    
    // const { selected } = this.state;
    // const selectedIndex = selected.indexOf(id);
    // let newSelected = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   );
    // }

    // this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    const { ClientGroupActions, clientGroupModule } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(clientGroupModule.listParam, {page: page}));
  };

  handleChangeRowsPerPage = event => {
    const { ClientGroupActions, clientGroupModule } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(clientGroupModule.listParam, {rowsPerPage: event.target.value}));
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  // .................................................

  // .................................................
  handleClientGroupDialogClose = value => {
    this.setState({ 
      clientGroupInfo: value, 
      clientGroupDialogOpen: false 
    });
  };



  showClientGroupDialog = value => {
    // const { clientGroupModule, ClientGroupActions } = this.props;

    // ClientGroupActions.showClientGroupInform({
    //   selectedItem: selectedItem,
    // });
    // this.setState({
    //   clientGroupDialogOpen: true 
    // });
  }

  handleCreateButton = () => {

    this.props.ClientGroupActions.showCreateDialog({
      dialogType: ClientGroupDialog.TYPE_ADD,
      dialogOpen: true
    });
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientGroupActions, clientGroupModule } = this.props;
    ClientGroupActions.readClientGroupList(getMergedListParam(clientGroupModule.listParam, param));
  };
  
  handleKeywordChange = name => event => {
    const { ClientGroupActions, clientGroupModule } = this.props;
    const newParam = getMergedListParam(clientGroupModule.listParam, {keyword: event.target.value});
    ClientGroupActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }

  render() {

    const { clientGroupModule, grConfirmModule } = this.props;
    const emptyRows = clientGroupModule.listParam.rowsPerPage - clientGroupModule.listData.length;

    // const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.state;
    // const emptyRows = rowsPerPage - data.length;

    return (

      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>

          {/* data option area */}
          <form className={formClass}>
            <FormControl className={formControlClass} autoComplete='off'>
              <TextField
                id='keyword'
                label='검색어'
                className={textFieldClass}
                value={clientGroupModule.listParam.keyword}
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
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant="raised"
              color="secondary"
              onClick={() => {
                this.handleCreateButton();
              }}
            >
              <Add className={leftIconClass} />
              등록
            </Button>
          </form>

          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <ClientGroupManageHead
                orderDir={clientGroupModule.listParam.orderDir}
                orderColumn={clientGroupModule.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
              {clientGroupModule.listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.grpId)}
                      key={n.grpId}
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
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
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
            component='div'
            count={clientGroupModule.listParam.rowsFiltered}
            rowsPerPage={clientGroupModule.listParam.rowsPerPage}
            rowsPerPageOptions={clientGroupModule.listParam.rowsPerPageOptions}
            page={clientGroupModule.listParam.page}
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
        <GrConfirm
          open={grConfirmModule.confirmOpen}
          confirmTitle={grConfirmModule.confirmTitle}
          confirmMsg={grConfirmModule.confirmMsg}
        />
        <ClientGroupDialog 
          open={clientGroupModule.informOpen}
          onClose={this.handleClientGroupDialogClose}
        />
      </React.Fragment>


    );
  }
}


const mapStateToProps = (state) => ({

  clientGroupModule: state.ClientGroupModule,
  grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(ClientGroupManage);


