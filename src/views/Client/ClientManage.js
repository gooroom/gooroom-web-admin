import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from 'modules/ClientManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getRowObjectById, getDataObjectVariableInComp, setSelectedIdsInComp, setAllSelectedIdsInComp } from 'components/GrUtils/GrTableListUtils';

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';

import GrCommonTableHead from 'components/GrComponents/GrCommonTableHead';

import Grid from '@material-ui/core/Grid';

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

import ClientDialog from "./ClientDialog";
import ClientManageInform from "./ClientManageInform";
// option components
import ClientGroupSelect from 'views/Options/ClientGroupSelect';
import ClientStatusSelect from 'views/Options/ClientStatusSelect';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientManage extends Component {

  columnHeaders = [
    { id: "chCheckbox", isCheckbox: true},
    { id: 'clientStatus', isOrder: true, numeric: false, disablePadding: true, label: '상태' },
    { id: 'clientId', isOrder: true, numeric: false, disablePadding: true, label: '단말아이디' },
    { id: 'clientName', isOrder: true, numeric: false, disablePadding: true, label: '단말이름' },
    { id: 'loginId', isOrder: true, numeric: false, disablePadding: true, label: '접속자' },
    { id: 'clientGroupName', isOrder: true, numeric: false,disablePadding: true,label: '단말그룹'},
    { id: 'regDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' }
  ];
  
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
  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId, {
      rowsPerPage: event.target.value, 
      page:0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    let orderDir = "desc";
    if (currOrderDir === "desc") {
      orderDir = "asc";
    }
    ClientManageActions.readClientListPaged(ClientManagePropsget, this.props.match.params.grMenuId, {
      orderColumn: property, 
      orderDir: orderDir
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const clickedRowObject = getRowObjectById(ClientManageProps, compId, id, 'clientId');
    const newSelectedIds = setSelectedIdsInComp(ClientManageProps, compId, id);

    ClientManageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });

    ClientManageActions.showClientManageInform({
      compId: compId,
      selectedViewItem: clickedRowObject,
    });
  };

  handleSelectBtnClick = () => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientListPaged(ClientManageProps, this.props.match.params.grMenuId);
  };

  handleKeywordChange = name => event => {
    this.props.ClientManageActions.changeListParamData({
      name: 'keyword', 
      value: event.target.value,
      compId: this.props.match.params.grMenuId
    });
  };

  handleChangeGroupSelect = (event, property) => {
    this.props.ClientManageActions.changeListParamData({
      name: 'groupId', 
      value: property,
      compId: this.props.match.params.grMenuId
    });
  };

  handleChangeClientStatusSelect = (event, property) => {
    this.props.ClientManageActions.changeListParamData({
      name: 'clientType', 
      value: property,
      compId: this.props.match.params.grMenuId
    });
  };


  isSelected = id => {
    const { ClientManageProps } = this.props;
    const selectedIds = getDataObjectVariableInComp(ClientManageProps, this.props.match.params.grMenuId, 'selectedIds');

    if(selectedIds) {
      return selectedIds.includes(id);
    } else {
      return false;
    }    
  }


  handleCreateButton = () => {
    console.log('handleCreateButton...............');
  }

  // // .................................................
  // handleClientDialogClose = value => {
  //   this.setState({ 
  //     clientInfos: value, 
  //     clientDialogOpen: false 
  //   });
  // };

  // handleInfoClick = (event, clientId, clientGroupId) => {
  //   event.stopPropagation();
  //   const { ClientManageActions, ClientManageProps } = this.props;
  //   const selectedViewItem = ClientManageProps.listData.find(function(element) {
  //     return element.clientId == clientId;
  //   });

  //   ClientManageActions.showDialog({
  //     selectedViewItem: Object.assign({}, selectedViewItem),
  //     dialogType: ClientDialog.TYPE_VIEW,
  //     dialogOpen: true,
  //     compId: ''
  //   });
  // };

  handleSelectAllClick = (event, checked) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    const newSelectedIds = setAllSelectedIdsInComp(ClientManageProps, compId, 'clientId', checked);

    ClientManageActions.changeCompVariable({
      name: 'selectedIds',
      value: newSelectedIds,
      compId: compId
    });
  };


  render() {
    const { classes } = this.props;
    const { ClientManageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;
    const listObj = ClientManageProps.getIn(['viewItems', compId]);

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
                <TextField id='keyword' label='검색어' onChange={this.handleKeywordChange('keyword')} />
                </FormControl>
              </Grid>

              <Grid item xs={3} >
                <Button size="small" variant="outlined" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
                  <Search />
                  조회
                </Button>

              </Grid>
            </Grid>

            <Grid item xs={2} container alignItems="flex-end" direction="row" justify="flex-end">
              <Button size="small" variant="contained" color="primary"
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
          {(listObj) && 
            <div>
            <Table>
              <GrCommonTableHead
                classes={classes}
                keyId="clientId"
                orderDir={listObj.getIn(['listParam', 'orderDir'])}
                orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
                onRequestSort={this.handleChangeSort}
                onSelectAllClick={this.handleSelectAllClick}
                selectedIds={listObj.get('selectedIds')}
                listData={listObj.get('listData')}
                columnData={this.columnHeaders}
              />
              <TableBody>
              {listObj.get('listData').map(n => {
                  const isSelected = this.isSelected(n.get('clientId'));
                  return (
                    <TableRow
                      className={classes.grNormalTableRow}
                      hover
                      onClick={event => this.handleRowClick(event, n.get('clientId'))}
                      role="checkbox"
                      aria-checked={isSelected}
                      key={n.get('clientId')}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox" className={classes.grSmallAndClickCell}>
                        <Checkbox checked={isSelected} className={classes.grObjInCell} />
                      </TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientStatus')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('loginId')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell} >{n.get('clientGroupName')}</TableCell>
                      <TableCell className={classes.grSmallAndClickCell}>{formatDateToSimple(n.get('regDate'), 'YYYY-MM-DD')}</TableCell>
                    </TableRow>
                  );
                })}

              {emptyRows > 0 && (
                <TableRow >
                  <TableCell
                    colSpan={this.columnHeaders.length + 1}
                    className={classes.grSmallAndClickCell}
                  />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component='div'
            count={listObj.getIn(['listParam', 'rowsFiltered'])}
            rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
            rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
            page={listObj.getIn(['listParam', 'page'])}
            labelDisplayedRows={() => {return ''}}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
          </div>
          }

        </GrPane>
        <ClientManageInform compId={compId} />

      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule,
  CommonOptionProps: state.CommonOptionModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientManage));

