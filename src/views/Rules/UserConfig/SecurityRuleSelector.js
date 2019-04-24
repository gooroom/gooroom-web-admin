import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateSecurityRuleObject } from './SecurityRuleSpec';

import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";


class SecurityRuleSelector extends Component {

  componentDidMount() {
    const { SecurityRuleProps, SecurityRuleActions, compId, targetType } = this.props;
    //
    SecurityRuleActions.readSecurityRuleList(SecurityRuleProps, compId, targetType);
    //
  }

  handleChange = (event, value) => {
    const { SecurityRuleActions, compId, targetType } = this.props;
    SecurityRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityRuleProps, compId, targetType);
    this.props.SecurityRuleActions.showDialog({
      viewItem: generateSecurityRuleObject(viewItem, false),
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================

  // .................................................
  render() {
    const { classes } = this.props;
    const { SecurityRuleProps, compId, targetType } = this.props;
    const { t, i18n } = this.props;
    
    const selectedObj = (targetType && targetType != '') ? SecurityRuleProps.getIn(['viewItems', compId, targetType]) : SecurityRuleProps.getIn(['viewItems', compId]);

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
        {selectedOptionItemId && selectedOptionItemId != '' &&
          <SecurityRuleSpec compId={compId} specType="inform" hasAction={false}
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
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(SecurityRuleSelector)));


