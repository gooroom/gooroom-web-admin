import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "moment";

import { formatDateToSimple, calculateDiffDays } from 'components/GRUtils/GRDates';
import { getSelectedObjectInComp, getValueInSelectedObjectInComp, getAvatarExplainForUser } from 'components/GRUtils/GRTableListUtils';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as PolicyKitRuleActions from 'modules/PolicyKitRuleModule';

import * as DesktopConfActions from 'modules/DesktopConfModule';

import { generateBrowserRuleObject } from 'views/Rules/UserConfig/BrowserRuleSpec';
import { generateMediaRuleObject } from 'views/Rules/UserConfig/MediaRuleSpec';
import { generateSecurityRuleObject } from 'views/Rules/UserConfig/SecurityRuleSpec';
import { generateSoftwareFilterObject } from 'views/Rules/UserConfig/SoftwareFilterSpec';
import { generateCtrlCenterItemObject } from 'views/Rules/UserConfig/CtrlCenterItemSpec';
import { generatePolicyKitRuleObject } from 'views/Rules/UserConfig/PolicyKitRuleSpec';

import UserDialog from './UserDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import LoginResetIcon from '@material-ui/icons/Flare';
import UserIcon from '@material-ui/icons/PersonPin';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import ReplayIcon from '@material-ui/icons/Replay';
import AlarmIcon from '@material-ui/icons/Alarm'

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

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserSpec extends Component {

   // edit
   handleClickEdit = (viewItem, compId) => {

    this.props.MediaRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.MediaRuleProps, compId, 'USER', 'objId')      
    });
    this.props.BrowserRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.BrowserRuleProps, compId, 'USER', 'objId')      
    });
    this.props.SecurityRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.SecurityRuleProps, compId, 'USER', 'objId')      
    });
    this.props.SoftwareFilterActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.SoftwareFilterProps, compId, 'USER', 'objId')      
    });
    this.props.CtrlCenterItemActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.CtrlCenterItemProps, compId, 'USER', 'objId')      
    });
    this.props.PolicyKitRuleActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.PolicyKitRuleProps, compId, 'USER', 'objId')      
    });
    this.props.DesktopConfActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.DesktopConfProps, compId, 'USER', 'confId')      
    });

    // expireDate 와 passwordExpireDate 를 초기값 설정
    // user expire date
    let userExpireDate = viewItem.get('expireDate');
    if(viewItem.get('isUseExpire') === '0' || viewItem.get('expireDate') === undefined || viewItem.get('expireDate') === '') {
      const initDate = moment().add(7, "days");
      userExpireDate = initDate.toJSON().slice(0, 10);
    }
    // password expire date
    let passwordExpireDate = viewItem.get('passwordExpireDate');
    if(viewItem.get('isUsePasswordExpire') === '0' || viewItem.get('passwordExpireDate') === undefined || viewItem.get('passwordExpireDate') === '') {
      const initDate = moment().add(7, "days");
      passwordExpireDate = initDate.toJSON().slice(0, 10);
    }

    this.props.UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: viewItem.get('userId'),
        userNm: viewItem.get('userNm'),
        deptCd: viewItem.get('deptCd'),
        deptNm: viewItem.get('deptNm'),
        isUseExpire: viewItem.get('isUseExpire'),
        expireDate: userExpireDate,
        isUsePasswordExpire: viewItem.get('isUsePasswordExpire'),
        passwordExpireDate: passwordExpireDate,        
        loginTrial: viewItem.get('loginTrial'),
        userEmail: viewItem.get('userEmail')
      },
      ruleDialogType: UserDialog.TYPE_EDIT
    }, true);
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
    const viewItem = getSelectedObjectInComp(this.props.PolicyKitRuleProps, compId, targetType);
    this.props.PolicyKitRuleActions.showDialog({
      viewItem: generatePolicyKitRuleObject(viewItem, false),
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

  handleResetTrialCount = (viewItem, compId) => {
    const { UserProps, GRConfirmActions } = this.props;
    const { t, i18n } = this.props;

    GRConfirmActions.showConfirm({
        confirmTitle: t("lbEditUserInfo"),
        confirmMsg: t("msgEditLoginTrialCount"),
        handleConfirmResult: (confirmValue, paramObject) => {
          if(confirmValue) {
            const { UserProps, UserActions, compId } = this.props;
            if(paramObject !== undefined) {
              UserActions.resetLoginTrailCount({
                  userId: paramObject.get('userId')
              }).then((res) => {
                  if(res.status && res.status && res.status.message) {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemNotice"),
                      alertMsg: res.status.message
                    });
                  }
                  UserActions.readUserListPaged(UserProps, compId);
                  this.handleClose();
              });
            }
          }
        },
        confirmObject: viewItem
    });
  }
  // ===================================================================

  render() {
    const { classes } = this.props;
    const { UserProps, compId, AdminProps, isEditable } = this.props;
    const { t, i18n } = this.props;

    const informOpen = UserProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = UserProps.getIn(['viewItems', compId, 'viewItem']);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedSoftwareFilterItem = this.props.SoftwareFilterProps.getIn(['viewItems', compId, 'USER']);
    const selectedCtrlCenterItem = this.props.CtrlCenterItemProps.getIn(['viewItems', compId, 'USER']);
    const selectedPolicyKit = this.props.PolicyKitRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'USER']);

    const avatarRef = getAvatarExplainForUser(this.props.t);
    
    let userSubinfo = null;
    let actionButton = null;
    if(informOpen && viewItem) {

      if(viewItem.get('loginTrial') < 1) {
        actionButton = <div style={{width:200,paddingTop:10,display:'flex'}}>
          <Chip icon={<LockIcon style={{color: "#fafafa"}}/>} label={t("lbAccountLocked")} style={{color: "#fafafa", backgroundColor: "#d50000", marginRight:18}}/>
          <Tooltip title={t("ttResetLoginTrial")}>
            <Button size="small"
              variant="outlined" color="primary" style={{minWidth:32,marginRight:18}}
              onClick={() => this.handleResetTrialCount(viewItem, compId)}
            ><LoginResetIcon /></Button>
          </Tooltip>
          <Button size="small"
            variant="outlined" color="primary" style={{minWidth:32}}
            onClick={() => this.handleClickEdit(viewItem, compId)}
          ><SettingsApplicationsIcon /></Button>
        </div>
      } else {
        actionButton = <div style={{width:280,paddingTop:10}}>
          <ReplayIcon style={{verticalAlign: 'middle', marginRight:5}}/>
          <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:10}}>{t("lbAccountRemailTrial")}</Typography>
          <Typography style={{display: 'inline-block', marginRight:8}}>[{viewItem.get('loginTrial')+t("lbAccountPossibleCnt")}]</Typography>
          <Button size="small"
            variant="outlined" color="primary" style={{minWidth:32}}
            onClick={() => this.handleClickEdit(viewItem, compId)}
          ><SettingsApplicationsIcon /></Button>
        </div>
      }

      userSubinfo = <div>
        <Card elevation={4}>
          <CardHeader
            avatar={
              <UserIcon fontSize="large"/>
            }
            title={<div>
              <Typography variant="h6" style={{display: 'inline-block', marginRight:18}}>{viewItem.get('userNm')}</Typography>
              <Chip avatar={<Avatar>ID</Avatar>} label={viewItem.get('userId')} style={{marginRight:18}}/></div>
            }
            action={ (isEditable && viewItem.get('statusCd') !== 'STAT020') ? actionButton : <div></div> }
          />
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <HowToRegIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:18}}>{t("lbUserRegistredDate")}</Typography>
                <Typography style={{display: 'inline-block'}}>{formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}</Typography>
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <EmailIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:18}}>{t("lbEmail")}</Typography>
                <Typography style={{display: 'inline-block'}}>{((viewItem.get('userEmail')) ? viewItem.get('userEmail') : ' - ')}</Typography>
              </Grid>
              {/* Expired Date */}
              <Grid item xs={12} md={12} lg={6} xl={6} > 
                <AlarmIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:18}}>{t("lbUserExpireDate")}</Typography>
                {(viewItem.get('expireDate')) ?
                  <div style={{display: 'inline-block'}}>
                  <Typography style={{display: 'inline-block', marginRight:18}}>{formatDateToSimple(viewItem.get('expireDate'), 'YYYY-MM-DD')}</Typography>
                  {(viewItem.get('userExpireRemainDate') < 1) ?
                    <Chip label={t("lbExpired")} style={{color: "#fafafa", backgroundColor: "#d50000"}}/> :
                    (viewItem.get('userExpireRemainDate')) >= 7 ? 
                      <Chip label={t("lbWillExpire") + viewItem.get('userExpireRemainDate') + t("lbExpiredDays")} color="primary"/> :
                      <Chip label={t("lbWillExpire") + viewItem.get('userExpireRemainDate') + t("lbExpiredDays")} color="secondary"/>
                  }</div> : <Typography style={{display: 'inline-block', marginRight:18}}>{t("optNoUse")}</Typography>
                }
              </Grid>
              {/* Password Expired Date */}
              <Grid item xs={12} md={12} lg={6} xl={6} >
                <AlarmIcon style={{verticalAlign: 'middle', marginRight:5}}/>
                <Typography style={{display: 'inline-block', fontWeight:'bold', marginRight:18}}>{t("lbPasswordExpireDate")}</Typography>
                {(viewItem.get('passwordExpireDate')) ? 
                  <div style={{display: 'inline-block'}}>
                  <Typography style={{display: 'inline-block', marginRight:18}}>{formatDateToSimple(viewItem.get('passwordExpireDate'), 'YYYY-MM-DD')}</Typography>
                  {(viewItem.get('isPasswordExpired') === '1') ?
                    <Chip label={t("lbExpired")} style={{color: "#fafafa", backgroundColor: "#d50000"}}/> :
                    (viewItem.get('pwdExpireRemainDate')) >= 7 ? 
                      <Chip label={t("lbWillExpire") + viewItem.get('pwdExpireRemainDate') + t("lbExpiredDays")} color="primary"/> :
                      <Chip label={t("lbWillExpire") + viewItem.get('pwdExpireRemainDate') + t("lbExpiredDays")} color="secondary"/>
                  }</div> : <Typography style={{display: 'inline-block', marginRight:18}}>{t("optNoUse")}</Typography>
                }
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>;
    }
 
    return (
      <div style={{marginTop: 10}} >
      {(informOpen && viewItem) &&
        <Card>
          <CardHeader
            title={userSubinfo}
          />
          <Divider />
          <CardContent style={{padding:10}}>
            {avatarRef}
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <BrowserRuleSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedBrowserRuleItem) ? selectedBrowserRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForBrowserRule} inherit={false}
                  isEditable={selectedBrowserRuleItem && AdminProps.get('adminId') === selectedBrowserRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <MediaRuleSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedMediaRuleItem) ? selectedMediaRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForMediaRule} inherit={false}
                  isEditable={selectedMediaRuleItem && AdminProps.get('adminId') === selectedMediaRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SecurityRuleSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('viewItem') : null}
                  ruleGrade={(selectedSecurityRuleItem) ? selectedSecurityRuleItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSecurityRule} inherit={false}
                  isEditable={selectedSecurityRuleItem && AdminProps.get('adminId') === selectedSecurityRuleItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <SoftwareFilterSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('viewItem') : null}
                  ruleGrade={(selectedSoftwareFilterItem) ? selectedSoftwareFilterItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForSoftwareFilter} inherit={false}
                  isEditable={selectedSoftwareFilterItem && AdminProps.get('adminId') === selectedSoftwareFilterItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <CtrlCenterItemSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedCtrlCenterItem) ? selectedCtrlCenterItem.get('viewItem') : null}
                  ruleGrade={(selectedCtrlCenterItem) ? selectedCtrlCenterItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForCtrlCenterItem} inherit={false}
                  isEditable={selectedCtrlCenterItem && AdminProps.get('adminId') === selectedCtrlCenterItem.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <PolicyKitRuleSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedPolicyKit) ? selectedPolicyKit.get('viewItem') : null}
                  ruleGrade={(selectedPolicyKit) ? selectedPolicyKit.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForPolicyKit} inherit={false}
                  isEditable={selectedPolicyKit && AdminProps.get('adminId') === selectedPolicyKit.getIn(['viewItem', 'regUserId'])}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId} specType="inform" targetType="USER" hasAction={true}
                  selectedItem={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('viewItem') : null}
                  ruleGrade={(selectedDesktopConfItem) ? selectedDesktopConfItem.get('ruleGrade') : null}
                  onClickEdit={this.handleClickEditForDesktopConf} inherit={false}
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
  AdminProps: state.AdminModule,

  MediaRuleProps: state.MediaRuleModule,
  BrowserRuleProps: state.BrowserRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  SoftwareFilterProps: state.SoftwareFilterModule,
  CtrlCenterItemProps: state.CtrlCenterItemModule,
  PolicyKitRuleProps: state.PolicyKitRuleModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
  PolicyKitRuleActions: bindActionCreators(PolicyKitRuleActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserSpec)));

