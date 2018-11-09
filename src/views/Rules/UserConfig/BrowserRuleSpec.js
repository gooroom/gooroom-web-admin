import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import BrowserRuleDialog from './BrowserRuleDialog';
import BrowserRuleViewer from './BrowserRuleViewer';



import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class BrowserRuleSpec extends Component {

  handleInheritClick = (objId, compType) => {
    const { BrowserRuleProps, BrowserRuleActions, compId, targetType } = this.props;
    const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(BrowserRuleProps, compId, targetType);

    BrowserRuleActions.showDialog({
      viewItem: generateBrowserRuleObject(viewItem),
      dialogType: BrowserRuleDialog.TYPE_INHERIT
    });
  };

  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let RuleAvartar = null;
    if(selectedItem) {
      viewItem = generateBrowserRuleObject(selectedItem.get('viewItem'));
      RuleAvartar = getAvatarForRuleGrade(targetType, selectedItem.get('ruleGrade'));
    }
    
    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
            <BrowserRuleViewer viewItem={viewItem} hasAction={true}
              avater={RuleAvartar}
              compType={compType}
              onClickEdit={this.props.onClickEdit}
              onClickCopy={this.props.onClickCopy}
            />
          </Card>
        }
      <BrowserRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleSpec));

export const generateBrowserRuleObject = (param) => {

  if(param) {
    let webSocket = '';
    let webWorker = '';

    let devToolRule__trust = '';
    let downloadRule__trust = '';
    let printRule__trust = '';
    let viewSourceRule__trust = '';

    let devToolRule__untrust = '';
    let downloadRule__untrust = '';
    let printRule__untrust = '';
    let viewSourceRule__untrust = '';

    let trustSetup = '';
    let untrustSetup = '';
    let trustUrlList = [];

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'websocket') {
        webSocket = evalue;
      } else if(ename == 'webworker') {
        webWorker = evalue;

      } else if(ename == 'devToolRule__trust') {
        devToolRule__trust = evalue;
      } else if(ename == 'downloadRule__trust') {
        downloadRule__trust = evalue;
      } else if(ename == 'printRule__trust') {
        printRule__trust = evalue;
      } else if(ename == 'viewSourceRule__trust') {
        viewSourceRule__trust = evalue;

      } else if(ename == 'devToolRule__untrust') {
        devToolRule__untrust = evalue;
      } else if(ename == 'downloadRule__untrust') {
        downloadRule__untrust = evalue;
      } else if(ename == 'printRule__untrust') {
        printRule__untrust = evalue;
      } else if(ename == 'viewSourceRule__untrust') {
        viewSourceRule__untrust = evalue;

      } else if(ename == 'trustSetup') {
        trustSetup = evalue;
      } else if(ename == 'untrustSetup') {
        untrustSetup = evalue;
      } else if(ename == 'trust') {
        trustUrlList.push(evalue);
      }
    });
  
    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      webSocket: webSocket,
      webWorker: webWorker,

      devToolRule__trust: devToolRule__trust,
      downloadRule__trust: downloadRule__trust,
      printRule__trust: printRule__trust,
      viewSourceRule__trust: viewSourceRule__trust,

      devToolRule__untrust: devToolRule__untrust,
      downloadRule__untrust: downloadRule__untrust,
      printRule__untrust: printRule__untrust,
      viewSourceRule__untrust: viewSourceRule__untrust,

      trustSetup: trustSetup,
      untrustSetup: untrustSetup,
      trustUrlList: List(trustUrlList)
    });
  
  } else {
    return param;
  }

};
