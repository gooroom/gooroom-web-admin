import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateClientHostNameObject } from './ClientHostNameSpec';

import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import ClientHostNameSpec from './ClientHostNameSpec';
import ClientHostNameDialog from './ClientHostNameDialog';

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
class ClientHostNameSelector extends Component {

  componentDidMount() {
    const { ClientHostNameProps, ClientHostNameActions, compId, initId, targetType } = this.props;
    //
    ClientHostNameActions.readClientHostNameList(ClientHostNameProps, compId, targetType);
    //
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(!ClientHostNameProps.getIn(List(targetNames).push('selectedOptionItemId'))) {
      ClientHostNameActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId,
        targetType: targetType
      });
    }
  }

  handleChange = (event, value) => {
    const { ClientHostNameActions, compId, targetType } = this.props;
    ClientHostNameActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientHostNameProps, compId, targetType);
    this.props.ClientHostNameActions.showDialog({
      viewItem: generateClientHostNameObject(viewItem, false),
      dialogType: ClientHostNameDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientHostNameProps, compId, targetType } = this.props;

    const selectedObj = (targetType && targetType != '') ? ClientHostNameProps.getIn(['viewItems', compId, targetType]) : ClientHostNameProps.getIn(['viewItems', compId]);

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
          <div style={{width:'100%',textAlign:'center'}}>
            <FormControl className={classes.formControl} style={{marginBottom: 10, marginTop: 26, padding: '0px 20px 0px 20px'}}>
              <Select value={selectedOptionItemId} style={{backgroundColor:'#f9eaea'}} onChange={this.handleChange} >
                <MenuItem key={'-'} value={'-'}>{t("selNoSelected")}</MenuItem>
                {listAllData.map(item => (
                  <MenuItem key={item.get('objId')} value={item.get('objId')}>{item.get('objNm')}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Hosts 정보를 선택하면 상세 내용이 표시됩니다.</FormHelperText>
            </FormControl>
          </div>
        }
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <ClientHostNameSpec compId={compId} specType="inform" hasAction={false}
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
  ClientHostNameProps: state.ClientHostNameModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientHostNameSelector));


