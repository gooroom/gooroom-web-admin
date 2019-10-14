import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from "moment";

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getSelectedObjectInComp, getValueInSelectedObjectInComp, getAvatarExplainForUser } from 'components/GRUtils/GRTableListUtils';

import * as UserActions from 'modules/UserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';

import * as DesktopConfActions from 'modules/DesktopConfModule';

import { generateBrowserRuleObject } from 'views/Rules/UserConfig/BrowserRuleSpec';
import { generateMediaRuleObject } from 'views/Rules/UserConfig/MediaRuleSpec';
import { generateSecurityRuleObject } from 'views/Rules/UserConfig/SecurityRuleSpec';
import { generateSoftwareFilterObject } from 'views/Rules/UserConfig/SoftwareFilterSpec';

import UserDialog from './UserDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import LoginResetIcon from '@material-ui/icons/Flare';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
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
    this.props.DesktopConfActions.changeCompVariable({compId:compId, name:'selectedOptionItemId', targetType:'USER',
      value: getValueInSelectedObjectInComp(this.props.DesktopConfProps, compId, 'USER', 'confId')      
    });

    this.props.UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: viewItem.get('userId'),
        userNm: viewItem.get('userNm'),
        deptCd: viewItem.get('deptCd'),
        deptNm: viewItem.get('deptNm')
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
  handleClickEditForDesktopConf = (compId, targetType) => {
    const viewItem = getSelectedObjectInComp(this.props.DesktopConfProps, compId, targetType);
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
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
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'USER']);

    const avatarRef = getAvatarExplainForUser(this.props.t);

    let userSubinfo = null;
    let actionButton = null;
    if(informOpen && viewItem) {
      userSubinfo = <div>
        {`[${t('colId')}:${viewItem.get('userId')}],[${t('colRegDate')}:${formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}}]`}
      </div>;
      actionButton = <div style={{width:48,paddingTop:10}}>
                      <Button size="small"
                        variant="outlined" color="primary" style={{minWidth:32}}
                        onClick={() => this.handleClickEdit(viewItem, compId)}
                      ><SettingsApplicationsIcon /></Button>
                    </div>
    }
 
    return (
      <div style={{marginTop: 10}} >
      {(informOpen && viewItem) &&
        <Card>
          <CardHeader
            title={viewItem.get('userNm')}
            subheader={userSubinfo}
            action={ (isEditable && viewItem.get('statusCd') !== 'STAT020') ? actionButton : <div></div> }
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
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserSpec)));

