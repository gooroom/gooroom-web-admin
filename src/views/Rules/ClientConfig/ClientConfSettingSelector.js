import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import ClientConfSettingSpec from './ClientConfSettingSpec';
import ClientConfSettingDialog from './ClientConfSettingDialog';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientConfSettingSelector extends Component {

  componentDidMount() {
    const { ClientConfSettingProps, ClientConfSettingActions, compId, initId } = this.props;
    ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps, compId);
    if(!ClientConfSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId'])) {
      ClientConfSettingActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId
      });
    }
  }

  handleChange = (event, value) => {
    this.props.ClientConfSettingActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value
    });
  };

  // ===================================================================
  handleEditClickForClientConfSetting = (viewItem, compType) => {
    this.props.ClientConfSettingActions.showDialog({
      selectedViewItem: viewItem,
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps, compId, targetType } = this.props;

    const selectedViewItem = ClientConfSettingProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientConfSettingProps.getIn(['viewItems', compId, 'listAllData']);
    let selectedOptionItemId = ClientConfSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']);

    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = listAllData.getIn([0, 'objId']);
    }

    let selectedClientConfSettingItem = null;
    if(listAllData && listAllData.size > 0) {
      const selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedClientConfSettingItem = Map({'selectedViewItem': selectedData});
      }      
    };

    return (
      <Card className={classes.card}>
        <CardContent style={{padding: 0}}>
        {listAllData && 
        <FormControl className={classes.formControl} style={{width: '100%', marginBottom: 24, marginTop: 8, border: 'dotted 1px lightGray'}}>
          <InputLabel htmlFor="cfg-helper"></InputLabel>
          <Select value={selectedOptionItemId}
            onChange={this.handleChange}
          >
          <MenuItem key={'-'} value={'-'}>없음</MenuItem>
          {listAllData.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>정책 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientConfSettingSpec compId={compId}
            specType="inform" targetType={targetType}
            selectedItem={selectedClientConfSettingItem}
            handleEditClick={this.handleEditClickForClientConfSetting}
          />
        }
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingSelector));


