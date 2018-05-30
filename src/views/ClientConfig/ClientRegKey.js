import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import moment from 'moment';

import { grLayout } from '../../templates/default/GrLayout';
import { grColor } from '../../templates/default/GrColors';
import { grRequestPromise } from '../../components/GrUtils/GrRequester';
import GrPageHeader from '../../containers/GrContent/GrPageHeader';
import GrConfirm from '../../components/GrComponents/GrConfirm';

import ClientRegKeyDialog from './ClientRegKeyDialog';
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
class ClientRegKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      confirmOpen: false,
      
      clientRegKeyDialogOpen: false,
      clientRegKeyDialogType: '',

      selectedRegKeyInfo: {
        regKeyNo: 'qqqqqqq',
        validDate: '',
        expireDate: '',
        ipRange: '',
        comment: ''
      },

      columnData: [
        { id: 'colRegKey', numeric: false, disablePadding: true, label: '단말등록키' },
        { id: 'colValidDate', numeric: false, disablePadding: true, label: '유효날짜' },
        { id: 'colExpireDate', numeric: false, disablePadding: true, label: '인증서만료날짜' },
        { id: 'colModDate', numeric: false, disablePadding: true, label: '등록일' },
        { id: 'colAction', numeric: false, disablePadding: true, label: '수정/삭제' },
      ],

      confirmTitle: '',
      confirmMsg: '',
      handleConfirmResult: null,
      
      keyword: '',

      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
      rowsTotal: 0,
      rowsFiltered: 0
    }

    this.formatDateToSimple = this.formatDateToSimple.bind(this);
  }

  fetchData(page, rowsPerPage, orderBy, order) {

    this.setState({
      page: page,
      rowsPerPage: rowsPerPage,
      orderBy: orderBy,
      order: order
    });

    grRequestPromise('/gpms/readRegKeyInfoList', {
      searchKey: this.state.keyword,

      start: page * rowsPerPage,
      length: rowsPerPage,
      orderColumn: orderBy,
      orderDir: order,
    }).then(res => {
        const listData = [];
        res.data.forEach(d => {
          d.validDate = this.formatDateToSimple(d.validDate, 'YYYY-MM-DD');
          d.expireDate = this.formatDateToSimple(d.expireDate, 'YYYY-MM-DD');
          d.modDate = this.formatDateToSimple(d.modDate, 'YYYY-MM-DD HH:mm');
          //this.testFunction('aaaa');
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
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.fetchData(this.state.page, this.state.rowsPerPage, orderBy, order);
  };
  
  handleClick = (event, id) => {
    event.stopPropagation();
    console.log('handleClick .. ' + id);
    const selectedItem = this.state.data.find(function(element) {
      return element.regKeyNo == id;
    });

    this.setState({ 
      selectedRegKeyInfo: selectedItem,
      clientRegKeyDialogType: ClientRegKeyDialog.TYPE_VIEW,
      clientRegKeyDialogOpen: true
    });
  };

  handleEditClick = (event, id) => {
    event.stopPropagation();
    console.log('handleEditClick .. ' + id);
    const selectedItem = this.state.data.find(function(element) {
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
    console.log('handleDeleteClick .. ' + id);
    const selectedItem = this.state.data.find(function(element) {
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
      console.log('>>> handleConfirmResult  ');
      console.log(params);
      console.log(this.state.selectedRegKeyInfo.regKeyNo);

      grRequestPromise('/gpms/deleteRegKeyData', {
          regKeyNo: this.state.selectedRegKeyInfo.regKeyNo,
        }).then(res => {
            this.handleClose();
        }, res => {
          this.handleClose();
      });        
    }

    this.setState({ 
      confirmOpen: false
    });
  };


  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    this.fetchData(page, this.state.rowsPerPage, this.state.orderBy, this.state.order);
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    this.fetchData(this.state.page, event.target.value, this.state.orderBy, this.state.order);
  };
  
  // .................................................

  // Events...
  handleChangeKeyword = name => event => {
    this.setState({ [name]: event.target.value });
  };

  // .................................................
  handleDialogClose = value => {
    this.setState({ 
      clientRegKeyInfo: value,
      clientRegKeyDialogOpen: false 
    });
  };

  handleRegKeyData = (name, value) => {
    let beforeInfo = this.state.selectedRegKeyInfo;
    beforeInfo[name] = value;
    this.setState({
      selectedRegKeyInfo: beforeInfo
    });

  };

  handleAddButton = value => {
    this.setState({
      selectedRegKeyInfo: {
        regKeyNo: '',
        validDate: '',
        expireDate: '',
        ipRange: '',
        comment: ''  
      },
      clientRegKeyDialogType: ClientRegKeyDialog.TYPE_ADD,
      clientRegKeyDialogOpen: true 
    });
  }


  formatDateToSimple = (value, format) => {
    try {
      const date = new Date(value);
      return moment(date).format(format);//date.toISOString().substring(0, 10);
    } catch (err) {
      console.log(err);
      return '';
    }
    //console.log(value);
  }
  
  render() {

    const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered, expanded } = this.state;
    const emptyRows = rowsPerPage - data.length;

    console.log('---- render ----');
    console.log(this.props.clientRegKey);
    console.log('---- ------ ----');

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
                onChange={this.handleChangeKeyword('keyword')}
                margin='dense'
              />
            </FormControl>
            <Button
              className={classNames(buttonClass, formControlClass)}
              variant='raised'
              color='primary'
              //onClick={() => {this.fetchData(0, this.state.rowsPerPage, this.state.orderBy, this.state.order);}}
              onClick={this.props.onReadClientRegKeyList}
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

              <TableHead>
                <TableRow>
                  {this.state.columnData.map(column => {
                    return (
                      <TableCell
                        className={tableCellClass}
                        key={column.id}
                        numeric={column.numeric}
                        padding={column.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === column.id ? order : false}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={order}
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
                {this.props.clientRegKey.regKeyList.dataList.map(n => {
                  return (
                    <TableRow
                      className={tableRowClass}
                      hover
                      onClick={event => this.handleClick(event, n.regKeyNo)}
                      tabIndex={-1}
                      key={n.regKeyNo}
                    >
                      <TableCell className={tableCellClass}>
                        {n.regKeyNo}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.validDate}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.expireDate}
                      </TableCell>
                      <TableCell className={tableCellClass}>
                        {n.modDate}
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
        <ClientRegKeyDialog
          type={this.state.clientRegKeyDialogType}
          selectedData={this.state.selectedRegKeyInfo}
          open={this.state.clientRegKeyDialogOpen}
          onClose={this.handleDialogClose}
          handleRegKeyData={this.handleRegKeyData}
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

const mapStateToProps = (state) => {
  console.log('--- STORE');
  console.log(state);
  
  return({
    clientRegKey: state.clientRegKey,
  });
};

const mapDispatchToProps = (dispatch) => ({
  onReadClientRegKeyList: () => dispatch(actions.readRegKeyList())
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientRegKey);
