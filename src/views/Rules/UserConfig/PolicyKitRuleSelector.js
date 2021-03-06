import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generatePolicyKitRuleObject } from './PolicyKitRuleSpec';

import * as PolicyKitRuleActions from 'modules/PolicyKitRuleModule';
import PolicyKitRuleSpec from 'views/Rules/UserConfig/PolicyKitRuleSpec';
import PolicyKitRuleDialog from 'views/Rules/UserConfig/PolicyKitRuleDialog';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class PolicyKitRuleSelector extends Component {

  componentDidMount() {
    const { PolicyKitRuleProps, PolicyKitRuleActions, compId, targetType } = this.props;
    //
    PolicyKitRuleActions.readPolicyKitRuleList(PolicyKitRuleProps, compId, targetType);
    //
  }
  
  handleChange = (event, value) => {
    const { PolicyKitRuleActions, compId, targetType } = this.props;
    PolicyKitRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.PolicyKitRuleProps, compId, targetType);
    this.props.PolicyKitRuleActions.showDialog({
      viewItem: generatePolicyKitRuleObject(viewItem, false),
      dialogType: PolicyKitRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { PolicyKitRuleProps, compId, targetType } = this.props;
    const { t, i18n } = this.props;
    const selectedObj = (targetType && targetType != '') ? PolicyKitRuleProps.getIn(['viewItems', compId, targetType]) : PolicyKitRuleProps.getIn(['viewItems', compId]);

    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;
    let selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    if(!selectedOptionItemId && listAllData && listAllData.size > 0) {
      selectedOptionItemId = '-';
    }

    let selectedPolicyKitRuleItem = null;
    let selectedData = null;
    if(listAllData && listAllData.size > 0) {
      selectedData = listAllData.find((element) => {
        return element.get('objId') == selectedOptionItemId;
      });
      if(selectedData) {
        selectedPolicyKitRuleItem = Map({'viewItem': selectedData});
      }      
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
          <PolicyKitRuleSpec compId={compId} specType="inform" hasAction={false}
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
  PolicyKitRuleProps: state.PolicyKitRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  PolicyKitRuleActions: bindActionCreators(PolicyKitRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PolicyKitRuleSelector)));


