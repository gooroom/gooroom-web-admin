import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp } from 'components/GRUtils/GRTableListUtils';
import { generateCtrlCenterItemObject } from './CtrlCenterItemSpec';

import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import CtrlCenterItemSpec from 'views/Rules/UserConfig/CtrlCenterItemSpec';
import CtrlCenterItemDialog from 'views/Rules/UserConfig/CtrlCenterItemDialog';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class CtrlCenterItemSelector extends Component {

  componentDidMount() {
    const { CtrlCenterItemProps, CtrlCenterItemActions, compId, targetType } = this.props;
    //
    CtrlCenterItemActions.readCtrlCenterItemList(CtrlCenterItemProps, compId, targetType);
    //
  }
  
  handleChange = (event, value) => {
    const { CtrlCenterItemActions, compId, targetType } = this.props;
    CtrlCenterItemActions.changeCompVariable({
      compId: compId,
      name: 'selectedOptionItemId',
      value: event.target.value,
      targetType: targetType
    });
  };

  // ===================================================================
  handleClickEdit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, targetType);
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: generateCtrlCenterItemObject(viewItem, false),
      dialogType: CtrlCenterItemDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  
  // .................................................
  render() {
    const { classes } = this.props;
    const { CtrlCenterItemProps, compId, targetType } = this.props;
    const { t, i18n } = this.props;
    
    const selectedObj = (targetType && targetType != '') ? CtrlCenterItemProps.getIn(['viewItems', compId, targetType]) : CtrlCenterItemProps.getIn(['viewItems', compId]);

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
          <CtrlCenterItemSpec compId={compId} specType="inform" hasAction={false}
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
  CtrlCenterItemProps: state.CtrlCenterItemModule
});

const mapDispatchToProps = (dispatch) => ({
  CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(CtrlCenterItemSelector)));


