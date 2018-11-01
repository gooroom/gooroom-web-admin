import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import ClientUpdateServerSpec from './ClientUpdateServerSpec';
import ClientUpdateServerDialog from './ClientUpdateServerDialog';

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
class ClientUpdateServerSelector extends Component {

  componentDidMount() {
    const { ClientUpdateServerProps, ClientUpdateServerActions, compId, initId, targetType } = this.props;
    //
    ClientUpdateServerActions.readClientUpdateServerList(ClientUpdateServerProps, compId, targetType);
    //
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(!ClientUpdateServerProps.getIn(List(targetNames).push('selectedOptionItemId'))) {
      ClientUpdateServerActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId,
        targetType: targetType
      });
    }
  }

  handleChange = (event, value) => {
    const { MediaRuleActions, compId, targetType } = this.props;
    MediaRuleActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleEditClickForClientUpdateServer = (viewItem, compType) => {
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientUpdateServerProps, compId, targetType } = this.props;

    const selectedObj = (targetType && targetType != '') ? ClientUpdateServerProps.getIn(['viewItems', compId, targetType]) : ClientUpdateServerProps.getIn(['viewItems', compId]);

    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;
    let selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = '-';
    }

    let selectedClientUpdateServerItem = null;
    if(listAllData && listAllData.size > 0) {
      const selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedClientUpdateServerItem = Map({'viewItem': selectedData});
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
          <FormHelperText>업데이트서버 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientUpdateServerSpec compId={compId}
            specType="inform" targetType={targetType}
            selectedItem={selectedClientUpdateServerItem}
            onClickEdit={this.handleEditClickForClientUpdateServer}
          />
        }
        </CardContent>
      </Card>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientUpdateServerProps: state.ClientUpdateServerModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerSelector));


