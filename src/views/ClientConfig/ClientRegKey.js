import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientRegKeyActions from '../../modules/ClientRegKeyModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam } from '../../components/GrUtils/GrCommonUtils';

import { grRequestPromise } from '../../components/GrUtils/GrRequester';
import GrPageHeader from '../../containers/GrContent/GrPageHeader';
import GrConfirm from '../../components/GrComponents/GrConfirm';

import ClientRegKeyDialog from './ClientRegKeyDialog';
import GrPane from '../../containers/GrContent/GrPane';

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
import AddIcon from '@material-ui/icons/Add';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';



//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
  paddingTop: '14px !important'
}).toString();

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

const tableHeadCellClass = css({
  whiteSpace: 'nowrap',
  padding: '0px !important'
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
class ClientRegKeyHead extends Component {

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  static columnData = [
    { id: 'colRegKey', numeric: false, disablePadding: true, label: '단말등록키' },
    { id: 'colValidDate', numeric: false, disablePadding: true, label: '유효날짜' },
    { id: 'colExpireDate', numeric: false, disablePadding: true, label: '인증서만료날짜' },
    { id: 'colModDate', numeric: false, disablePadding: true, label: '등록일' },
    { id: 'colAction', numeric: false, disablePadding: true, label: '수정/삭제' },
  ];

  render() {
    const { orderDir, orderColumn, } = this.props;

    return (
      <TableHead>
        <TableRow>
          {ClientRegKeyHead.columnData.map(column => {
            return (
              <TableCell
                className={tableCellClass}
                key={column.id}
                sortDirection={orderColumn === column.id ? orderDir : false}
              >
              {(() => {
                if(column.isOrder) {
                  return <TableSortLabel
                  active={orderColumn === column.id}
                  direction={orderDir}
                  onClick={this.createSortHandler(column.id)}
                >
                  {column.label}
                </TableSortLabel>
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
class ClientRegKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientRegKeyActions, ClientRegKeyProps } = this.props;
    ClientRegKeyActions.readClientRegkeyList(getMergedListParam(ClientRegKeyProps.listParam, param));
  };
  
  handleAddButton = () => {
    this.setState({
      selectedRegKeyInfo: {
        regKeyNo: '',
        validDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        expireDate: (new Date()).setMonth((new Date()).getMonth() + 1),
        ipRange: '',
        comment: ''
      },
      clientRegKeyDialogType: ClientRegKeyDialog.TYPE_ADD,
      clientRegKeyDialogOpen: true 
    });
  }
  
  handleRowClick = (event, id) => {
    const { ClientRegKeyProps } = this.props;
    const selectedItem = ClientRegKeyProps.listData.find(function(element) {
      return element.regKeyNo == id;
    });

    ClientProfileSetActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientRegKeyDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.listData.find(function(element) {
      return element.regKeyNo == id;
    });

    this.setState({ 
      selectedRegKeyInfo: selectedItem,
      clientRegKeyDialogType: ClientRegKeyDialog.TYPE_EDIT,
      clientRegKeyDialogOpen: true
    });
  };

  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.listData.find(function(element) {
      return element.regKeyNo == id;
    });

    this.setState({ 
      selectedRegKeyInfo: selectedItem,
      confirmTitle: '단말등록키 삭제',
      confirmMsg: '단말등록키(' + selectedItem.regKeyNo + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };

  handleDeleteConfirmResult = (params) => {
    if(params) {
      grRequestPromise('/gpms/deleteRegKeyData', {
          regKeyNo: this.state.selectedRegKeyInfo.regKeyNo,
        }).then(res => {
          this.handleRefreshList();
        }, res => {
          //
      });        
    }
    this.setState({ 
      confirmOpen: false
    });
  };

  handleRefreshList = () => {
    this.props.ClientRegKeyActions.readClientRegkeyList({
      keyword: this.state.keyword,
      page: this.props.page,
      rowsPerPage: this.props.rowsPerPage,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });
  }

  // 페이지 번호 변경
  handleChangePage = (event, page) => {

    this.props.ClientRegKeyActions.readClientRegkeyList({
      keyword: this.state.keyword,
      page: page,
      rowsPerPage: this.props.rowsPerPage,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });

    //this.fetchData(page, this.state.rowsPerPage, this.state.orderColumn, this.state.orderDir);
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    //this.fetchData(this.state.page, event.target.value, this.state.orderColumn, this.state.orderDir);
    this.props.ClientRegKeyActions.readClientRegkeyList({
      keyword: this.state.keyword,
      page: this.props.page,
      rowsPerPage: event.target.value,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });

  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>');
    const { ClientRegKeyProps, ClientRegKeyActions } = this.props;
    let orderDir = "desc";
    if (ClientRegKeyProps.listParam.orderColumn === property && ClientRegKeyProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientRegKeyActions.readClientRegkeyList(getMergedListParam(ClientRegKeyProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  // .................................................

  // .................................................
  handleDialogClose = value => {
    this.setState({ 
      clientRegKeyInfo: value,
      clientRegKeyDialogOpen: false 
    });
  };

  handleKeywordChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  handleRegKeyChangeData = (name, value) => {
    let beforeInfo = this.state.selectedRegKeyInfo;
    beforeInfo[name] = value;
    this.setState({
      selectedRegKeyInfo: beforeInfo
    });
  };


  render() {

    const { listData, orderDir, orderColumn, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.props;
    const { ClientRegKeyProps } = this.props;
    const emptyRows = ClientRegKeyProps.listParam.rowsPerPage - ClientRegKeyProps.listData.length;

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
                value={this.state.keyword}
                onChange={this.handleKeywordChange('keyword')}
                margin='dense'
              />
            </FormControl>
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='primary'
              onClick={ () => this.handleSelectBtnClick({pageNo: 0}) }
            >
              <Search className={leftIconClass} />
              조회
            </Button>

            <div className={formEmptyControlClass} />

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='secondary'
              onClick={() => {
                this.handleAddButton();
              }}
            >
              <AddIcon className={leftIconClass} />
              등록
            </Button>
          </form>
          {/* data area */}
          <div className={tableContainerClass}>
            <Table className={tableClass}>

              <ClientRegKeyHead
                orderDir={ClientRegKeyProps.listParam.orderDir}
                orderColumn={ClientRegKeyProps.listParam.orderColumn}
                onRequestSort={this.handleRequestSort}
              />

              <TableBody>
                {ClientRegKeyProps.listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.regKeyNo)}
                      tabIndex={-1}
                      key={n.regKeyNo}
                    >
                      <TableCell className={tableCellClass}>
                        {n.regKeyNo}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.validDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.expireDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {formatDateToSimple(n.modDate, 'YYYY-MM-DD')}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        <Button variant='fab' color='secondary' aria-label='edit' className={actButtonClass} onClick={event => this.handleEditClick(event, n.regKeyNo)}>
                          <BuildIcon className={toolIconClass} />
                        </Button>
                        <Button variant='fab' color='secondary' aria-label='delete' className={actButtonClass} onClick={event => this.handleDeleteClick(event, n.regKeyNo)}>
                          <DeleteIcon className={toolIconClass} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow style={{ height: 32 * emptyRows }}>
                    <TableCell
                      colSpan={ClientRegKeyHead.columnData.length + 1}
                      className={tableCellClass}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            component='div'
            count={ClientRegKeyProps.listParam.rowsFiltered}
            rowsPerPage={ClientRegKeyProps.listParam.rowsPerPage}
            rowsPerPageOptions={ClientRegKeyProps.listParam.rowsPerPageOptions}
            page={ClientRegKeyProps.listParam.page}
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
        <ClientRegKeyDialog
          open={this.state.clientRegKeyDialogOpen}

          type={this.state.clientRegKeyDialogType}
          selectedData={this.state.selectedRegKeyInfo}
          onClose={this.handleDialogClose}
          handleRegKeyChangeData={this.handleRegKeyChangeData}
          handleRefreshList={this.handleRefreshList}
        />
        <GrConfirm
          open={this.state.confirmOpen}
          confirmTitle={this.state.confirmTitle}
          confirmMsg={this.state.confirmMsg}
          resultConfirm={this.state.handleConfirmResult}
        />

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({

  ClientRegKeyProps: state.ClientRegKeyModule,
  grConfirmModule: state.GrConfirmModule,
  
  // return({
  //   listData: state.ClientRegKeyModule.listData,
  //   error: state.ClientRegKeyModule.error,
  //   orderDir: state.ClientRegKeyModule.orderDir,
  //   orderColumn: state.ClientRegKeyModule.orderColumn,
  //   page: state.ClientRegKeyModule.page,
  //   pending: state.ClientRegKeyModule.pending,
  //   rowsFiltered: state.ClientRegKeyModule.rowsFiltered,
  //   rowsPerPage: state.ClientRegKeyModule.rowsPerPage,
  //   rowsTotal: state.ClientRegKeyModule.rowsTotal,
  //   keyword: state.ClientRegKeyModule.keyword
  // });

});

const mapDispatchToProps = (dispatch) => ({

  ClientRegKeyActions: bindActionCreators(ClientRegKeyActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(ClientRegKey);
