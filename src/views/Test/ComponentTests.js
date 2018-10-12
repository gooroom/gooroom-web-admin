import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getMergedObject } from 'components/GRUtils/GRCommonUtils';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRPane from 'containers/GRContent/GRPane';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import ClientGroupComp from 'views/ClientGroup/ClientGroupComp'
import ClientManageComp from 'views/Client/ClientManageComp'

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


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
    ClientConfSettingActions.readClientConfSettingListPaged(getMergedObject(ClientConfSettingProps.listParam, param));
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
    const { ClientConfSettingProps, ClientConfSettingActions, GRConfirmActions } = this.props;

    const selectedViewItem = ClientConfSettingProps.listData.find(function(element) {
      return element.objId == id;
    });

    ClientConfSettingActions.setSelectedItemObj({
      selectedViewItem: Object.assign(ClientConfSettingProps.selectedViewItem, selectedViewItem)
    });
    const re = GRConfirmActions.showConfirm({
      confirmTitle: '단말정책정보 삭제',
      confirmMsg: '단말정책정보(' + selectedViewItem.objId + ')를 삭제하시겠습니까?',
      handleConfirmResult: this.handleDeleteConfirmResult,
      confirmOpen: true
    });
  };
  handleDeleteConfirmResult = (confirmValue) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;

    if(confirmValue) {
      ClientConfSettingActions.deleteClientConfSettingData({
        objId: ClientConfSettingProps.selectedViewItem.objId
      }).then(() => {
        ClientConfSettingActions.readClientConfSettingListPaged(ClientConfSettingProps.listParam);
        }, () => {
      });
    }
  };

  // 페이지 번호 변경
  handleChangePage = (event, page) => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(getMergedObject(ClientConfSettingProps.listParam, {page: page}));
  };

  // 페이지당 레코드수 변경
  handleChangeRowsPerPage = event => {
    const { ClientConfSettingActions, ClientConfSettingProps } = this.props;
    ClientConfSettingActions.readClientConfSettingListPaged(getMergedObject(ClientConfSettingProps.listParam, {rowsPerPage: event.target.value, page: 0}));
  };
  
  // .................................................
  handleRequestSort = (event, property) => {
    const { ClientConfSettingProps, ClientConfSettingActions } = this.props;
    let orderDir = "desc";
    if (ClientConfSettingProps.listParam.orderColumn === property && ClientConfSettingProps.listParam.orderDir === "desc") {
      orderDir = "asc";
    }
    ClientConfSettingActions.readClientConfSettingListPaged(getMergedObject(ClientConfSettingProps.listParam, {orderColumn: property, orderDir: orderDir}));
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



  handleChangeGroupSelected_first = (newSelected, selectedViewItem) => {

  }


  handleChangeGroupSelected_second = (newSelected, selectedViewItem) => {

  }

  handleChangeClientSelected_first = (newSelected, selectedViewItem) => {

  }


  handleChangeClientSelected_second = (newSelected, selectedViewItem) => {

  }

  render() {

    const { ClientConfSettingProps } = this.props;
    const emptyRows = ClientConfSettingProps.listParam.rowsPerPage - ClientConfSettingProps.listData.length;

    return (
      <React.Fragment>
        <GRPageHeader path={this.props.location.pathname} name={this.props.match.params.grMenuName} />
        <GRPane>
          <div>

              컴포넌트 테스트.
              <Grid container spacing={24}>
                <Grid item xs={6} sm={4}>

                  <ClientGroupComp compId='first' onChangeGroupSelected={this.handleChangeGroupSelected_first} />
                
                </Grid>
                <Grid item xs={6} sm={4}>
                
                  <ClientGroupComp compId='second' onChangeGroupSelected={this.handleChangeGroupSelected_second} />

                </Grid>
                <Grid item xs={6} sm={4}>
                  <Paper>xs=6 sm=3</Paper>
                </Grid>

                <Grid item xs={6} sm={6}>

                  <ClientManageComp compId='first' onChangeClientSelected={this.handleChangeClientSelected_first} />
                
                </Grid>
                <Grid item xs={6} sm={6}>
                
                  <ClientManageComp compId='second' onChangeClientSelected={this.handleChangeClientSelected_second} />

                </Grid>


              </Grid>
              
              
          </div>

        </GRPane>
        <GRConfirm />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ComponentTests));
