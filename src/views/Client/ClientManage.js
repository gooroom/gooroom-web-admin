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
import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

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
import SearchIcon from '@material-ui/icons/Search';
import DescIcon from '@material-ui/icons/Description';

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

const toolIconClass = css({
  height: '16px !important',
}).toString();

//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientManageHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'clientId', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'clientView', isOrder: false, numeric: false, disablePadding: true, label: <DescIcon className={toolIconClass} /> },
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'loginId', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    {
      id: 'clientGroupName', isOrder: true, 
      numeric: false,
      disablePadding: true,
      label: '단말그룹'
    },
    { id: 'regDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' }
  ];

  render() {

    const {
      onSelectAllClick,
      orderDir,
      orderColumn,
      selectedData,
      listData
    } = this.props;

    const checkSelection = arrayContainsArray(selectedData, listData.map(x => x.clientId));
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox" className={tableHeadCellClass} >
            <Checkbox
              indeterminate={checkSelection === 50}
              checked={checkSelection === 100}
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
    };
  }

  componentDidMount() {
  }

  // .................................................
  handleRequestSort = (event, property) => {

    const { ClientManageActions, ClientManageProps } = this.props;
    let orderDir = "desc";
    if (ClientManageProps.listParam.orderColumn === property && ClientManageProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {orderColumn: property, orderDir: orderDir}));
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
    
    const { ClientManageProps } = this.props;
    return ClientManageProps.selected.indexOf(id) !== -1;
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {page: page}));
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {rowsPerPage: event.target.value, page:0}));
  };

  handleSelectBtnClick = (param) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, param));
  };

  handleKeywordChange = name => event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedListParam(ClientManageProps.listParam, {keyword: event.target.value});
    // ClientManageActions.changeParamValue({
    //   name: 'listParam',
    //   value: newParam
    // });
    ClientManageActions.changeStoreData({name: 'listParam', value: newParam});
  };

  handleRowClick = (event, id) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const { selected : preSelected } = ClientManageProps;
    const selectedIndex = preSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(preSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(preSelected.slice(1));
    } else if (selectedIndex === preSelected.length - 1) {
      newSelected = newSelected.concat(preSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        preSelected.slice(0, selectedIndex),
        preSelected.slice(selectedIndex + 1)
      );
    }

    ClientManageActions.changeStoreData({
      name: 'selected',
      value: newSelected
    });
  };

  handleInfoClick = (event, clientId, clientGroupId) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps } = this.props;
    const selectedItem = ClientManageProps.listData.find(function(element) {
      return element.clientId == clientId;
    });

    ClientManageActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    if(checked) {
      const newSelected = ClientManageProps.listData.map(n => n.clientId)
      ClientManageActions.changeStoreData({
        name: 'selected',
        value: newSelected
      });
    } else {
      ClientManageActions.changeStoreData({
        name: 'selected',
        value: []
      });
    }
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
              <ClientStatusSelect
                onChangeSelect={this.handleChangeClientStatusSelect}
              />
            </FormControl>

            <FormControl className={formControlClass} autoComplete="off">
              <InputLabel htmlFor="client-group">단말그룹</InputLabel>
              <ClientGroupSelect  
                onChangeSelect={this.handleChangeGroupSelect}
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
              <SearchIcon className={leftIconClass} />
              조회
            </Button>
          </form>

            <div className={tableContainerClass}>
              <Table className={tableClass}>
                <ClientManageHead
                  onSelectAllClick={this.handleSelectAllClick}
                  orderDir={ClientManageProps.listParam.orderDir}
                  orderColumn={ClientManageProps.listParam.orderColumn}
                  onRequestSort={this.handleRequestSort}
                  selectedData={ClientManageProps.selected}
                  listData={ClientManageProps.listData}
                />
                <TableBody>
                  {ClientManageProps.listData
                    .map(n => {
                      const isSelected = this.isSelected(n.clientId);
                      return (
                        <TableRow
                          className={tableRowClass}
                          hover
                          onClick={event => this.handleRowClick(event, n.clientId)}
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
                          <TableCell className={tableCellClass} 
                            onClick={event => this.handleInfoClick(event, n.clientId, n.clientGroupId)}
                          >
                            <DescIcon className={toolIconClass} />
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
                            {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
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

