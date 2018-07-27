import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject } from 'components/GrUtils/GrCommonUtils';

import GrPageHeader from 'containers/GrContent/GrPageHeader';
import GrConfirm from 'components/GrComponents/GrConfirm';

import GrPane from 'containers/GrContent/GrPane';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp'
import ClientManageComp from 'views/Client/ClientManageComp'



//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ##########
//
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


const paperClass = css({
  padding: theme.spacing.unit * 2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
}).toString();



//
//  ## Content ########## ########## ########## ########## ########## 
//
class ComponentTests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  // .................................................
  handleSelectBtnClick = (param) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, param));
  };
  
  handleCreateButton = () => {

  }
  
  handleRowClick = (event, id) => {
    
  };

  handleEditClick = (event, id) => {
    //event.stopPropagation();

  };

  // delete
  handleDeleteClick = (event, id) => {
    event.stopPropagation();
    const { ClientConfSettingProps, ClientConfSettingActions, GrConfirmActions } = this.props;

    const selectedItem = ClientConfSettingProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientConfSettingActions.setSelectedItemObj({
      selectedItem: Object.assign(ClientConfSettingProps.selectedItem, selectedItem)
    });
    const re = GrConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + selectedItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;

    if(confirmValue) {
      ClientConfSettingActions.deleteClientConfSettingData({
        objId: ClientConfSettingProps.selectedItem.objId
      }).then(() => {
        ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps.listParam);
        }, () => {
      });
    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {rowsPerPage: event.target.value}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    let orderDir = "desc";
    if (ClientConfSettingProps.listParam.orderColumn === property && ClientConfSettingProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientConfSettingActions.readClientConfSettingList(getMergedObject(ClientConfSettingProps.listParam, {orderColumn: property, orderDir: orderDir}));
  };
  // .................................................

  // .................................................
  handleKeywordChange = name => event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    const newParam = getMergedObject(ClientConfSettingProps.listParam, {keyword: event.target.value});
    ClientConfSettingActions.changeStoreData({
      name: 'listParam',
      value: newParam
    });
  }



  handleChangeGroupSelected_first = (newSelected, selectedItem) => {

  }


  handleChangeGroupSelected_second = (newSelected, selectedItem) => {

  }

  handleChangeClientSelected_first = (newSelected, selectedItem) => {

  }


  handleChangeClientSelected_second = (newSelected, selectedItem) => {

  }

  render() {

    const { ClientConfSettingProps } = this.props;
    const emptyRows = ClientConfSettingProps.listParam.rowsPerPage - ClientConfSettingProps.listData.length;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          <div className={tableContainerClass}>

              컴포넌트 테스트.
              <Grid container spacing={24}>
                <Grid item xs={6} sm={4}>

                  <ClientGroupComp compId='first' onChangeGroupSelected={this.handleChangeGroupSelected_first} />
                
                </Grid>
                <Grid item xs={6} sm={4}>
                
                  <ClientGroupComp compId='second' onChangeGroupSelected={this.handleChangeGroupSelected_second} />

                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper className={paperClass}>xs=6 sm=3</Paper>
                </Grid>

                <Grid item xs={6} sm={6}>

                  <ClientManageComp compId='first' onChangeClientSelected={this.handleChangeClientSelected_first} />
                
                </Grid>
                <Grid item xs={6} sm={6}>
                
                  <ClientManageComp compId='second' onChangeClientSelected={this.handleChangeClientSelected_second} />

                </Grid>


              </Grid>
              
              
          </div>

        </GrPane>
        <GrConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentTests);
