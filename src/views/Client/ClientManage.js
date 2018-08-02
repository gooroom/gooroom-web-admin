import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageCompModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';

import Grid from '@material-ui/core/Grid';

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
import DescIcon from '@material-ui/icons/Description';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";

// option components
import ClientGroupSelect from 'views/Options/ClientGroupSelect';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';



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
    { id: 'clientView', isOrder: false, numeric: false, disablePadding: true, label: <DescIcon /> },
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
    const { classes } = this.props;
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
          <TableCell padding="checkbox" className={classes.grSmallAndHeaderCell}>
            <Checkbox
              indeterminate={checkSelection === 50}
              checked={checkSelection === 100}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {ClientManageHead.columnData.map(column => {
            return (
              <TableCell
                className={classes.grSmallAndHeaderCell}
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
    this.handleSelectBtnClick();
  }



  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    let orderDir = "desc";
    if (ClientManageProps.listParam.orderColumn === property && ClientManageProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientManageActions.readClientList(getMergedObject(ClientManageProps.listParam, {
      orderColumn: property, 
      orderDir: orderDir,
      compId: ''
    }));
  };

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

  isSelected = id => {
    
    const { ClientManageProps } = this.props;
    return ClientManageProps.selected.indexOf(id) !== -1;
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedObject(ClientManageProps.listParam, {
      page: page,
      compId: ''
    }));
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedObject(ClientManageProps.listParam, {
      rowsPerPage: event.target.value, 
      page:0,
      compId: ''
    }));
  };

  handleSelectBtnClick = () => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedObject(ClientManageProps.listParam, {
      page: 0,
      compId: ''
    }));
  };

  handleKeywordChange = name => event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedObject(ClientManageProps.listParam, {
      keyword: event.target.value,
    });
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
      value: newSelected,
      compId: ''
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
      dialogOpen: true,
      compId: ''
    });
  };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    if(checked) {
      const newSelected = ClientManageProps.listData.map(n => n.clientId)
      ClientManageActions.changeStoreData({
        name: 'selected',
        value: newSelected,
        compId: ''
      });
    } else {
      ClientManageActions.changeStoreData({
        name: 'selected',
        value: [],
        compId: ''
      });
    }
  };

  handleChangeGroupSelect = (event, property) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedObject(ClientManageProps.listParam, {
      groupId: property
    });
    ClientManageActions.changeStoreData({name: 'listParam', value: newParam});
  };

  handleChangeClientStatusSelect = (event, property) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedObject(ClientManageProps.listParam, {
      clientType: property
    });
    ClientManageActions.changeStoreData({name: 'listParam', value: newParam});
  };

  render() {
    const { classes } = this.props;
    //const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered } = this.state;
    const { ClientManageProps } = this.props;
    //const emptyRows = rowsPerPage - data.length;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;


    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GrPane>

          {/* data option area */}
          <Grid item xs={12} container alignItems="flex-end" direction="row" justify="space-between" >
            <Grid item xs={10} spacing={24} container alignItems="flex-end" direction="row" justify="flex-start" >

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="client-status">단말상태</InputLabel>
                  <ClientStatusSelect onChangeSelect={this.handleChangeClientStatusSelect} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                  <InputLabel htmlFor="client-status">단말그룹</InputLabel>
                  <ClientGroupSelect onChangeSelect={this.handleChangeGroupSelect} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <FormControl fullWidth={true}>
                <TextField
                  id='keyword'
                  label='검색어'
                  value={ClientManageProps.listParam.keyword}
                  onChange={this.handleKeywordChange('keyword')}
                />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={ () => this.handleSelectBtnClick() }
                >
                  <Search />
                  조회
                </Button>

              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleCreateButton();
                }}
              >
                <AddIcon />
                등록
              </Button>
            </Grid>
          </Grid>

          {/* data area */}
          <div>
            <Table>

              <ClientManageHead
                classes={classes}
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
                        className={classes.grNormalTableRow}
                        hover
                        onClick={event => this.handleRowClick(event, n.clientId)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.clientId}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                          <Checkbox checked={isSelected} className={classes.grObjInCell} />
                        </TableCell>
                        <TableCell className={classes.grSmallAndClickCell} >{n.clientStatus}</TableCell>
                        <TableCell className={classes.grSmallAndClickCell} >{n.clientId}</TableCell>
                        <TableCell className={classes.grSmallAndClickCell} onClick={event => this.handleInfoClick(event, n.clientId, n.clientGroupId)} >
                          <DescIcon className={classes.buttonInTableRow} />
                        </TableCell>
                        <TableCell className={classes.grSmallAndClickCell} >{n.clientName}</TableCell>
                        <TableCell className={classes.grSmallAndClickCell} >{n.loginId}</TableCell>
                        <TableCell className={classes.grSmallAndClickCell} >{n.clientGroupName}</TableCell>
                        <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.regDate, 'YYYY-MM-DD')}</TableCell>
                      </TableRow>
                    );
                  })}

                {emptyRows > 0 && (
                  <TableRow >
                    <TableCell colSpan={ClientManageHead.columnData.length + 1} />
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
  ClientManageProps: state.ClientManageCompModule,
  CommonOptionProps: state.CommonOptionModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManage));

