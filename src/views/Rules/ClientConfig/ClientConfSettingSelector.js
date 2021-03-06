import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateClientConfSettingObject } from './ClientConfSettingSpec';

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
import { translate, Trans } from "react-i18next";


class ClientConfSettingSelector extends Component {

  componentDidMount() {
    const { ClientConfSettingProps, ClientConfSettingActions, compId, targetType } = this.props;
    //
    ClientConfSettingActions.readClientConfSettingList(ClientConfSettingProps, compId, targetType);
    //
  }

  handleChange = (event, value) => {
    const { ClientConfSettingActions, compId, targetType } = this.props;
    ClientConfSettingActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.ClientConfSettingProps, compId, targetType);
    this.props.ClientConfSettingActions.showDialog({
      viewItem: generateClientConfSettingObject(viewItem, false, this.props.t),
      dialogType: ClientConfSettingDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientConfSettingProps, compId, targetType } = this.props;
    const { t, i18n } = this.props;
    
    const selectedObj = (targetType && targetType != '') ? ClientConfSettingProps.getIn(['viewItems', compId, targetType]) : ClientConfSettingProps.getIn(['viewItems', compId]);

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
              <FormHelperText>{t("msgShowSpecAsSelectRule")}</FormHelperText>
            </FormControl>
          </div>
        }
        {selectedOptionItemId && selectedOptionItemId != '' && selectedOptionItemId != '-' &&
          <ClientConfSettingSpec compId={compId} specType="inform" hasAction={false}
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
  ClientConfSettingProps: state.ClientConfSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientConfSettingSelector)));


