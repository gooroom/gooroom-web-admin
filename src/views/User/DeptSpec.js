import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedObjectInComp, getValueInSelectedObjectInComp, getAvatarExplainForUser } from 'components/GRUtils/GRTableListUtils';

import * as UserActions from 'modules/UserModule';
import * as DeptActions from 'modules/DeptModule';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as PolicyKitActions from 'modules/PolicyKitRuleModule';

import * as DesktopConfActions from 'modules/DesktopConfModule';

import { generateBrowserRuleObject } from 'views/Rules/UserConfig/BrowserRuleSpec';
import { generateMediaRuleObject } from 'views/Rules/UserConfig/MediaRuleSpec';
import { generateSecurityRuleObject } from 'views/Rules/UserConfig/SecurityRuleSpec';
import { generateSoftwareFilterObject } from 'views/Rules/UserConfig/SoftwareFilterSpec';
import { generateCtrlCenterItemObject } from 'views/Rules/UserConfig/CtrlCenterItemSpec';
import { generatePolicyKitObject } from 'views/Rules/UserConfig/PolicyKitRuleSpec';

import DeptDialog from './DeptDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
import CtrlCenterItemDialog from 'views/Rules/UserConfig/CtrlCenterItemDialog';
import CtrlCenterItemSpec from 'views/Rules/UserConfig/CtrlCenterItemSpec';
import PolicyKitRuleDialog from 'views/Rules/UserConfig/PolicyKitRuleDialog';
import PolicyKitRuleSpec from 'views/Rules/UserConfig/PolicyKitRuleSpec';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import Avatar from '@material-ui/core/Avatar';
import DefaultIcon from '@material-ui/icons/Language';
import DeptIcon from '@material-ui/icons/BusinessCenter';
import UserIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/LaptopChromebook';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptSpec extends Component {

  // edit
  handleClickEdit = (paramObj, compId) => {

    this.props.MediaRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.MediaRuleProps, compId, 'DEPT', 'objId')      
    });
    this.props.BrowserRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.BrowserRuleProps, compId, 'DEPT', 'objId')      
    });
    this.props.SecurityRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.SecurityRuleProps, compId, 'DEPT', 'objId')      
    });
    this.props.SoftwareFilterActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.SoftwareFilterProps, compId, 'DEPT', 'objId')      
    });
    this.props.CtrlCenterItemActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, 'DEPT', 'objId')      
    });
    this.props.PolicyKitActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.PolicyKitProps, compId, 'DEPT', 'objId')      
    });
    this.props.DesktopConfActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'DEPT',
      value: getValueInSelectedObjectInComp(this.props.DesktopConfProps, compId, 'DEPT', 'confId')      
    });

    this.props.DeptActions.showDialog({
      viewItem: {
        deptCd: paramObj.get('deptCd'),
        deptNm: paramObj.get('deptNm')
      },
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  // ===================================================================
  handleClickEditForBrowserRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.BrowserRuleProps, compId, targetType);
    this.props.BrowserRuleActions.showDialog({
      viewItem: generateBrowserRuleObject(viewItem, false, this.props.t),
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForMediaRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.MediaRuleProps, compId, targetType);
    this.props.MediaRuleActions.showDialog({
      viewItem: generateMediaRuleObject(viewItem, false),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForSecurityRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityRuleProps, compId, targetType);
    this.props.SecurityRuleActions.showDialog({
      viewItem: generateSecurityRuleObject(viewItem, false),
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForSoftwareFilter = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: generateSoftwareFilterObject(viewItem, false),
      dialogType: SoftwareFilterDialog.TYPE_EDIT
    });
  };
  handleClickEditForCtrlCenterItem = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, targetType);
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: generateCtrlCenterItemObject(viewItem, false),
      dialogType: CtrlCenterItemDialog.TYPE_EDIT
    });
  };
  handleClickEditForPolicyKit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.PolicyKitProps, compId, targetType);
    this.props.PolicyKitActions.showDialog({
      viewItem: generatePolicyKitObject(viewItem, false),
      dialogType: PolicyKitRuleDialog.TYPE_EDIT
    });
  };
  handleClickEditForDesktopConf = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
  // ===================================================================
  handleClickInheritForBrowserRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.BrowserRuleProps, compId, targetType);
    this.props.BrowserRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: BrowserRuleDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForMediaRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.MediaRuleProps, compId, targetType);
    this.props.MediaRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForSecurityRule = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SecurityRuleProps, compId, targetType);
    this.props.SecurityRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForSoftwareFilter = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.SoftwareFilterProps, compId, targetType);
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForCtrlCenterItem = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, targetType);
    this.props.CtrlCenterItemActions.showDialog({
      viewItem: viewItem,
      dialogType: CtrlCenterItemDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForPolicyKit = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.PolicyKitProps, compId, targetType);
    this.props.PolicyKitActions.showDialog({
      viewItem: viewItem,
      dialogType: PolicyKitRuleDialog.TYPE_INHERIT_DEPT
    });
  };
  handleClickInheritForDesktopConf = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_INHERIT_DEPT
    });
  };
  // ===================================================================

  // .................................................
  render() {
    const { DeptProps, compId, AdminProps, isEditable } = this.props;

    const informOpen = DeptProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = DeptProps.getIn(['viewItems', compId, 'viewItem']);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedSoftwareFilterItem = this.props.SoftwareFilterProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedCtrlCenterItem = this.props.CtrlCenterItemProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedPolicyKit = this.props.PolicyKitProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'DEPT']);

    const avatarRef = getAvatarExplainForUser(this.props.t);

    return (
      <div style={{marginTop: 10}}>
      {(informOpen && viewItem) &&
        <Card>
          <CardHeader
            title={viewItem.get('deptNm')}
            subheader={viewItem.get('deptCd')}
            action={ (isEditable) ?
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleClickEdit(viewItem, compId)}
                ><SettingsApplicationsIcon /></Button>
              </div> : <div></div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            {avatarRef}
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <BrowserRuleSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForBrowserRule}
                  onClickInherit={this.handleClickInheritForBrowserRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedBrowserRuleItem && AdminProps.get('adminId') === selectedBrowserRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <MediaRuleSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForMediaRule}
                  onClickInherit={this.handleClickInheritForMediaRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedMediaRuleItem && AdminProps.get('adminId') === selectedMediaRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SecurityRuleSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSecurityRule}
                  onClickInherit={this.handleClickInheritForSecurityRule}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedSecurityRuleItem && AdminProps.get('adminId') === selectedSecurityRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <SoftwareFilterSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('viewItem') : null}
                  ruleGrade={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSoftwareFilter}
                  onClickInherit={this.handleClickInheritForSoftwareFilter}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedSoftwareFilterItem && AdminProps.get('adminId') === selectedSoftwareFilterItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <CtrlCenterItemSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedCtrlCenterItem) ? selectedCtrlCenterItem.get('viewItem') : null}
                  ruleGrade={(selectedCtrlCenterItem) ? selectedCtrlCenterItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForCtrlCenterItem}
                  onClickInherit={this.handleClickInheritForCtrlCenterItem}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedCtrlCenterItem && AdminProps.get('adminId') === selectedCtrlCenterItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <PolicyKitRuleSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedPolicyKit) ? selectedPolicyKit.get('viewItem') : null}
                  ruleGrade={(selectedPolicyKit) ? selectedPolicyKit.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForPolicyKit}
                  onClickInherit={this.handleClickInheritForPolicyKit}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedPolicyKit && AdminProps.get('adminId') === selectedPolicyKit.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId} specType="inform" targetType="DEPT" hasAction={true}
                  selectedItem={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('viewItem') : null}
                  ruleGrade={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForDesktopConf}
                  onClickInherit={this.handleClickInheritForDesktopConf}
                  inherit={viewItem.get('hasChildren')}
                  isEditable={selectedDesktopConfItem && AdminProps.get('adminId') === selectedDesktopConfItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  UserProps: state.UserModule,
  DeptProps: state.DeptModule,
  AdminProps: state.AdminModule,

  MediaRuleProps: state.MediaRuleModule,
  BrowserRuleProps: state.BrowserRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  SoftwareFilterProps: state.SoftwareFilterModule,
  CtrlCenterItemProps: state.CtrlCenterItemModule,
  PolicyKitProps: state.PolicyKitRuleModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  DeptActions: bindActionCreators(DeptActions, dispatch),

  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
  PolicyKitActions: bindActionCreators(PolicyKitActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptSpec)));

