import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateUpdateServerObject } from './ClientUpdateServerSpec';

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
    const { ClientUpdateServerActions, compId, targetType } = this.props;
    ClientUpdateServerActions.changeCompVariable({
      compId: this.props.compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientUpdateServerProps, compId, targetType);
    this.props.ClientUpdateServerActions.showDialog({
      viewItem: generateUpdateServerObject(viewItem, false),
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

    let selectedData = null;
    if(listAllData && listAllData.size > 0) {
      selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
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
          <MenuItem key={'-'} value={'-'}>지정안함</MenuItem>
          {listAllData.map(item => (
            <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
          ))}
          </Select>
          <FormHelperText>업데이트서버 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
        </FormControl>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientUpdateServerSpec compId={compId} specType="inform" hasAction={false}
            targetType={targetType} selectedItem={selectedData}
            onClickEdit={this.handleClickEdit}
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


