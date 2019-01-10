import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateBrowserRuleObject } from './BrowserRuleSpec';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';

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
class BrowserRuleSelector extends Component {

  componentDidMount() {
    const { BrowserRuleProps, BrowserRuleActions, compId, initId, targetType } = this.props;
    //
    BrowserRuleActions.readBrowserRuleList(BrowserRuleProps, compId, targetType);
    // 
    const targetNames = (targetType && targetType != '') ? ['viewItems', compId, targetType] : ['viewItems', compId];
    if(!BrowserRuleProps.getIn(List(targetNames).push('selectedOptionItemId'))) {
      BrowserRuleActions.changeCompVariable({
        compId: compId,
        name: 'selectedOptionItemId',
        value: initId,
        targetType: targetType
      });
    }
  }

  handleChange = (event, value) => {
	const { BrowserRuleActions, compId, targetType } = this.props;
    BrowserRuleActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.BrowserRuleProps, compId, targetType);
    this.props.BrowserRuleActions.showDialog({
      viewItem: generateBrowserRuleObject(viewItem, false),
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { BrowserRuleProps, compId, targetType } = this.props;

    const selectedObj = (targetType && targetType != '') ? BrowserRuleProps.getIn(['viewItems', compId, targetType]) : BrowserRuleProps.getIn(['viewItems', compId]);

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
          <BrowserRuleSpec compId={compId} specType="inform" hasAction={false}
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
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleSelector));


