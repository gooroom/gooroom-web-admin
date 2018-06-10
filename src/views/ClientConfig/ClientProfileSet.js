import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as clientProfileSetActions from '../../modules/clientProfileSetModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';

import { grLayout } from '../../templates/default/GrLayout';
import { grColor } from '../../templates/default/GrColors';
import { grRequestPromise } from '../../components/GrUtils/GrRequester';
import GrPageHeader from '../../containers/GrContent/GrPageHeader';
import GrConfirm from '../../components/GrComponents/GrConfirm';

import ClientProfileSetDialog from './ClientProfileSetDialog';
import GrPane from '../../containers/GrContent/GrPane';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

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
import Icon from '@material-ui/core/Icon';
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
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientProfileSet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      confirmOpen: false,
      
      clientProfileSetDialogOpen: false,
      clientProfileSetDialogType: '',

      selectedProfileSetInfo: {
        profileNo: '',
        validDate: '',
        expireDate: '',
        ipRange: '',
        comment: ''
      },

      columnData: [
        { id: 'colProfileSetNo', numeric: false, disablePadding: true, label: '번호' },
        { id: 'colProfileSetName', numeric: false, disablePadding: true, label: '이름' },
        { id: 'colRegDate', numeric: false, disablePadding: true, label: '등록일' },
        { id: 'colModDate', numeric: false, disablePadding: true, label: '수정일' },
        { id: 'colAction', numeric: false, disablePadding: true, label: '수정/삭제' },
      ],

      confirmTitle: '',
      confirmMsg: '',
      handleConfirmResult: null,
      
      keyword: ''

    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    this.props.ClientProfileSetActions.readClientProfileSetList({
      keyword: this.state.keyword,
      page: param.pageNo,
      rowsPerPage: this.props.rowsPerPage,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });
  };
  
  handleAddButton = () => {

    this.props.ClientProfileSetActions.showDialog({
      dialogType: ClientProfileSetDialog.TYPE_ADD,
      dialogOpen: true
    });
  }
  
  handleRowClick = (event, id) => {

    const selectedItem = this.props.listData.find(function(element) {
      return element.profileNo == id;
    });

    this.props.ClientProfileSetActions.showDialog({
      selectedItem: selectedItem,
      dialogType: ClientProfileSetDialog.TYPE_VIEW,
      dialogOpen: true
    });

    // this.setState({ 
    //   selectedProfileSetInfo: selectedItem,
    //   clientProfileSetDialogType: ClientProfileSetDialog.TYPE_VIEW,
    //   clientProfileSetDialogOpen: true
    // });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.listData.find(function(element) {
      return element.profileNo == id;
    });

    this.setState({ 
      selectedProfileSetInfo: selectedItem,
      clientProfileSetDialogType: ClientProfileSetDialog.TYPE_EDIT,
      clientProfileSetDialogOpen: true
    });
  };

  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const selectedItem = this.props.listData.find(function(element) {
      return element.profileNo == id;
    });

    this.setState({ 
      selectedProfileSetInfo: selectedItem,
      confirmTitle: '단말등록키 삭제',
      confirmMsg: '단말등록키(' + selectedItem.profileNo + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };

  handleDeleteConfirmResult = (params) => {
    if(params) {
      grRequestPromise('/gpms/deleteProfileSetData', {
          profileNo: this.state.selectedProfileSetInfo.profileNo,
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
    this.props.ClientProfileSetActions.readClientProfileSetList({
      keyword: this.state.keyword,
      page: this.props.page,
      rowsPerPage: this.props.rowsPerPage,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });
  }

  // 페이지 번호 변경
  handleChangePage = (event, page) => {

    this.props.ClientProfileSetActions.readClientProfileSetList({
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
    this.props.ClientProfileSetActions.readClientProfileSetList({
      keyword: this.state.keyword,
      page: this.props.page,
      rowsPerPage: event.target.value,
      orderColumn: this.props.orderColumn,
      orderDir: this.props.orderDir
    });

  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const orderColumn = property;
    let orderDir = 'desc';
    if (this.state.orderColumn === property && this.state.orderDir === 'desc') {
      orderDir = 'asc';
    }
    //this.fetchData(this.state.page, this.state.rowsPerPage, orderColumn, orderDir);
  };
  // .................................................

  // .................................................
  // handleDialogClose = value => {
  //   console.log('[P] handleDialogClose()...');
  //   this.setState({ 
  //     clientProfileSetInfo: value,
  //     clientProfileSetDialogOpen: false 
  //   });
  // };

  handleKeywordChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  }

  handleProfileSetChangeData = (name, value) => {
    let beforeInfo = this.state.selectedProfileSetInfo;
    beforeInfo[name] = value;
    this.setState({
      selectedProfileSetInfo: beforeInfo
    });
  };

  render() {

    const { listData, orderDir, orderColumn, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.props;
    const { dialogOpen } = this.props;
    const emptyRows = rowsPerPage - listData.length;

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
              onClick={() => this.handleSelectBtnClick({pageNo: 0})}
            >
              <Search className={leftIconClass} />
              조회
            </Button>

            <div className={formEmptyControlClass} />

            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='secondary'
              onClick={() => this.handleAddButton()}
            >
              <AddIcon className={leftIconClass} />
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
                        padding={column.disablePadding ? 'none' : 'default'}
                        sortDirection={orderColumn === column.id ? orderDir : false}
                      >
                        <TableSortLabel
                          active={orderColumn === column.id}
                          direction={orderDir}
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
                {listData.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleRowClick(event, n.profileNo)}
                      key={n.profileNo}
                    >
                      <TableCell className={tableCellClass}>{n.profileNo}</TableCell>
                      <TableCell className={tableCellClass}>{n.profileName}</TableCell>
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
            component='div'
            count={rowsFiltered}
            rowsPerPage={rowsPerPage}
            page={page}
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
        <ClientProfileSetDialog
          open={dialogOpen}
          handleProfileSetChangeData={this.handleProfileSetChangeData}
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

    listData: state.clientProfileSetModule.listData,
    error: state.clientProfileSetModule.error,
    orderDir: state.clientProfileSetModule.orderDir,
    orderColumn: state.clientProfileSetModule.orderColumn,
    page: state.clientProfileSetModule.page,
    pending: state.clientProfileSetModule.pending,
    rowsFiltered: state.clientProfileSetModule.rowsFiltered,
    rowsPerPage: state.clientProfileSetModule.rowsPerPage,
    rowsTotal: state.clientProfileSetModule.rowsTotal,
    keyword: state.clientProfileSetModule.keyword,
    dialogOpen: state.clientProfileSetModule.dialogOpen

});


const mapDispatchToProps = (dispatch) => ({

  ClientProfileSetActions: bindActionCreators(clientProfileSetActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientProfileSet);
