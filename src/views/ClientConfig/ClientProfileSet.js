import React, { Component } from 'react';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientProfileSetActions from '../../modules/ClientProfileSetModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import GrPageHeader from '../../containers/GrContent/GrPageHeader';
import GrConfirm from '../../components/GrComponents/GrConfirm';

import ClientProfileSetDialog from './ClientProfileSetDialog';
import GrPane from '../../containers/GrContent/GrPane';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import AssignmentIcon from '@material-ui/icons/Assignment';
import DeleteIcon from '@material-ui/icons/Delete';



//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();


const formClass = css({
  marginBottom: '6px !important',
    display: 'flex'
}).toString();

const formControlClass = css({
  minWidth: '100px !important',
    marginRight: '15px !important',
    flexGrow: 1
}).toString();

const formEmptyControlClass = css({
  flexGrow: '6 !important'
}).toString();

const textFieldClass = css({
  marginTop: '3px !important'
}).toString();

const buttonClass = css({
  margin: theme.spacing.unit + ' !important'
}).toString();

const leftIconClass = css({
  marginRight: theme.spacing.unit + ' !important'
}).toString();

const tableClass = css({
  minWidth: '700px !important'
}).toString();


const tableContainerClass = css({
  overflowX: 'auto',
  '&::-webkit-scrollbar': {
    position: 'absolute',
    height: 10,
    marginLeft: '-10px',
    },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#CFD8DC', 
    },
  '&::-webkit-scrollbar-thumb': {
    height: '30px',
    backgroundColor: '#78909C',
    backgroundClip: 'content-box',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '1px 1px',
    }
}).toString();

const tableRowClass = css({
  height: '2em !important'
}).toString();

const tableCellClass = css({
  height: '1em !important',
  padding: '0px !important',
  cursor: 'pointer'
}).toString();


const actButtonClass = css({
    margin: '5px !important',
    height: '24px !important',
    minHeight: '24px !important',
    width: '24px !important',
}).toString();

const toolIconClass = css({
  height: '16px !important',
}).toString();



//
//  ## Header ########## ########## ########## ########## ########## 
//
class ClientProfileSetHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'chProfileSetNo', isOrder: true, numeric: false, disablePadding: true, label: '번호' },
    { id: 'chProfileSetName', isOrder: true, numeric: false, disablePadding: true, label: '이름' },
    { id: 'chClientId', isOrder: true, numeric: false, disablePadding: true, label: 'Ref단말아이디' },
    { id: 'chRegDate', isOrder: true, numeric: false, disablePadding: true, label: '등록일' },
    { id: 'chModDate', isOrder: true, numeric: false, disablePadding: true, label: '수정일' },
    { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: '수정/삭제' },
    { id: 'chProfile', isOrder: false, numeric: false, disablePadding: true, label: '프로파일' },
  ];

  render() {
    const {
      orderDir,
      orderColumn
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientProfileSetHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(column.isOrder) &&
                <TableSortLabel
                  active={orderColumn === column.id}
                  direction={orderDir}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
              }
              {(!column.isOrder) &&
                  <p>{column.label}</p>
              }
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
class ClientProfileSet extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientProfileSetActions, profileSetModule } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedListParam(profileSetModule.listParam, param));
  };
  
  handleCreateButton = () => {
    this.props.ClientProfileSetActions.showDialog({
      dialogType: ClientProfileSetDialog.TYPE_ADD,
      dialogOpen: true
    });
  }
  
  handleRowClick = (event, id) => {
    const { profileSetModule, ClientProfileSetActions } = this.props;
    const selectedItem = profileSetModule.listData.find(function(element) {
      return element.profileNo == id;
    });
    ClientProfileSetActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientProfileSetDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.profileSetModule.listData.find(function(element) {
      return element.profileNo == id;
    });
    this.props.ClientProfileSetActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientProfileSetDialog.TYPE_EDIT,
      dialogOpen: true
    });
  };

  handleProfileClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.profileSetModule.listData.find(function(element) {
      return element.profileNo == id;
    });
    this.props.ClientProfileSetActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientProfileSetDialog.TYPE_PROFILE,
      dialogOpen: true
    });
  };

  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.profileSetModule.listData.find(function(element) {
      return element.profileNo == id;
    });

    this.props.ClientProfileSetActions.setSelectedItem({
      selectedItem: selectedItem
    });

    const re = this.props.GrConfirmActions.showConfirm({
      confirmTitle: '단말프로파일 삭제',
      confirmMsg: '단말프로파일(' + selectedItem.profileNo + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });

  };

  handleDeleteConfirmResult = (confirmValue) => {
    const { profileSetModule } = this.props;
    if(confirmValue) {
      this.props.ClientProfileSetActions.deleteClientProfileSetData({
        profile_no: profileSetModule.selectedItem.profileNo
      }).then(() => {
          this.props.ClientProfileSetActions.readClientProfileSetList(getMergedListParam(profileSetModule.listParam, {}));
        }, () => {
        });
    }

    this.setState({ 
      confirmOpen: false
    });
  };
  
  // 페이지 번호 변경
  handleChangePage = (event, page) => {

    const { ClientProfileSetActions, profileSetModule } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedListParam(profileSetModule.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = (event) => {

    const { ClientProfileSetActions, profileSetModule } = this.props;
    ClientProfileSetActions.readClientProfileSetList(getMergedListParam(profileSetModule.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  // TODO: sort...
  handleRequestSort = (event, property) => {

    const { profileSetModule, ClientProfileSetActions } = this.props;
    let orderDir = "desc";
    if (profileSetModule.listParam.orderColumn === property && profileSetModule.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientProfileSetActions.readClientProfileSetList(getMergedListParam(profileSetModule.listParam, {orderColumn: property, orderDir: orderDir}));
  }
  // .................................................

  handleKeywordChange = name => event => {
    const { ClientProfileSetActions, profileSetModule } = this.props;
    const newParam = getMergedListParam(profileSetModule.listParam, {keyword: event.target.value});
    ClientProfileSetActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  }

  render() {

    const { profileSetModule } = this.props;
    const emptyRows = profileSetModule.listParam.rowsPerPage - profileSetModule.listData.length;

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
                value={profileSetModule.listParam.keyword}
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
              variant='raised'
              color='secondary'
              onClick={() => this.handleCreateButton()}
            >
              <AddIcon className={leftIconClass} />
              등록
            </Button>
          </form>
          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <ClientProfileSetHead
                orderDir={profileSetModule.listParam.orderDir}
                orderColumn={profileSetModule.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {profileSetModule.listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.profileNo)}
                      key={n.profileNo}
                    >
                      <TableCell className={tableCellClass}>{n.profileNo}</TableCell>
                      <TableCell className={tableCellClass}>{n.profileName}</TableCell>
                      <TableCell className={tableCellClass}>{n.clientId}</TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.regDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        <Button variant='fab' color='secondary' aria-label='edit' className={actButtonClass} onClick={event => this.handleEditClick(event, n.profileNo)}>
                          <BuildIcon className={toolIconClass} />
                        </Button>
                        <Button variant='fab' color='secondary' aria-label='delete' className={actButtonClass} onClick={event => this.handleDeleteClick(event, n.profileNo)}>
                          <DeleteIcon className={toolIconClass} />
                        </Button>
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        <Button variant='fab' color='secondary' aria-label='profile' className={actButtonClass} onClick={event => this.handleProfileClick(event, n.profileNo)}>
                          <AssignmentIcon className={toolIconClass} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={ClientProfileSetHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={profileSetModule.listParam.rowsFiltered}
            rowsPerPage={profileSetModule.listParam.rowsPerPage}
            page={profileSetModule.listParam.page}
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
        {/* dialog(popup) component area */}
        <ClientProfileSetDialog />
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({

    profileSetModule: state.ClientProfileSetModule,
    grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  ClientProfileSetActions: bindActionCreators(ClientProfileSetActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfileSet);
