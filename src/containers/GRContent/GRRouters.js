import React, { Component } from "react";
import PropTypes from "prop-types";

import { Switch, Route, Redirect } from "react-router-dom";
import * as Constants from "components/GRComponents/GRConstants";

import Dashboard from "containers/Dashboard/";
import PartMain from "containers/PartMain/";
import PortableUserMain from "views/Portable/User/PortableUserMain";
// Client - client management
import ClientMasterManage from "views/Client/ClientMasterManage";

import ClientRegKey from "views/ClientSupport/ClientRegKey";
import ClientProfileSet from "views/ClientSupport/ClientProfileSet";

import ClientConfSettingManage from "views/Rules/ClientConfig/ClientConfSettingManage";
import ClientHostNameManage from "views/Rules/HostName/ClientHostNameManage";
import ClientUpdateServerManage from "views/Rules/UpdateServer/ClientUpdateServerManage";

import MediaRuleManage from "views/Rules/UserConfig/MediaRuleManage";
import BrowserRuleManage from "views/Rules/UserConfig/BrowserRuleManage";
import SecurityRuleManage from "views/Rules/UserConfig/SecurityRuleManage";
import SoftwareFilterManage from "views/Rules/UserConfig/SoftwareFilterManage";
import CtrlCenterItemManage from "views/Rules/UserConfig/CtrlCenterItemManage";
import PolicyKitRuleManage from "views/Rules/UserConfig/PolicyKitRuleManage";

import JobManage from "views/Job/JobManage";
import PackageManage from 'views/ClientPackage/ClientPackageManage';

import UserMasterManage from "views/User/UserMasterManage";
import UserReqManage from "views/User/UserReqManage";

import AdminUserManage from "views/System/AdminUserManage";
import ServerSiteConfig from "views/System/ServerSiteConfig";
import DeptUserReg from "views/System/DeptUserReg";
import GcspManage from "views/System/GcspManage";
import ThemeManage from "views/System/ThemeManage";

import DesktopAppManage from "views/Rules/DesktopConfig/DesktopApp/DesktopAppManage";
import DesktopConfManage from "views/Rules/DesktopConfig/DesktopConfManage";

import SecurityLogManage from "views/Logs/SecurityLogManage";
import GeneralLogManage from "views/Logs/GeneralLogManage";
import DailyViolatedManage from "views/Stats/DailyViolatedManage";
import DailyLoginCountManage from "views/Stats/DailyLoginCountManage";
import DailyClientCountManage from "views/Stats/DailyClientCountManage";

import NoticeMasterManage from "views/Notice/NoticeMasterManage";
import DividedAdminManage from "views/Admin/DividedAdmin/DividedAdminManage";

/* for PTGR */
import PortableBulkManage from 'views/Portable/Admin/PortableBulkManage';
import PortableApplyManage from 'views/Portable/Admin/PortableApplyManage';
import PortableImageManage from 'views/Portable/Admin/PortableImageManage';
import PortableServerManage from 'views/Portable/Admin/PortableServerManage';

import PortableUserApply from 'views/Portable/User/PortableUserApply';
import PortableUserReview from 'views/Portable/User/PortableUserReview';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRRouters extends Component {
  constructor(props) {
    super(props);

    this.renderAdmin = this.renderAdmin.bind(this);
  }

  getBasename = () => {
    if(window.gpmsain === Constants.SUPER_RULECODE) {
      return PartMain;
    } else if(window.gpmsain === Constants.ADMIN_RULECODE) {
        return Dashboard;
    } else if(window.gpmsain === Constants.PART_RULECODE) {
        return PartMain;
    }
    /*
    else if(window.gpmsain === Constants.USER_RULECODE) {
        return PortableUserMain;
    }
    */
  }

  renderSuper = () => {
    return (
      <Switch>
        <Route path="/system/adminusermng/:grMenuId/:grMenuName" component={DividedAdminManage} />
        <Route path="/system/siteconfig/:grMenuId/:grMenuName" component={ServerSiteConfig} />
        <Route path="/system/deptuserreg/:grMenuId/:grMenuName" component={DeptUserReg} />

        {/* 사용 안함 */}
        {/*<Route path="/portable/ptgrservermng/:grMenuId/:grMenuName" component={PortableServerManage} />*/}
        <Route path="/log/generallog/:grMenuId/:grMenuName" component={GeneralLogManage} />
      </Switch>
    )
  }

  renderAdmin = () => {
    return (
      <Switch>
        <Route path="/portable/ptgrservermng/:grMenuId/:grMenuName" component={PortableServerManage} />
        <Route path="/dashboard" name="Dashboard" component={Dashboard} />

        <Route path="/system/adminusermng/:grMenuId/:grMenuName" component={DividedAdminManage} />

        <Route path="/statistic/dailyviolated/:grMenuId/:grMenuName" component={DailyViolatedManage} />
        <Route path="/statistic/dailyconnect/:grMenuId/:grMenuName" component={DailyLoginCountManage} />
        <Route path="/statistic/dailyregist/:grMenuId/:grMenuName" component={DailyClientCountManage} />
        <Route path="/log/secretlog/:grMenuId/:grMenuName" component={SecurityLogManage} />
        
        <Route path="/clients/clientmastermanage/:grMenuId/:grMenuName" component={ClientMasterManage} />
        <Route path="/clientconfig/regkey/:grMenuId/:grMenuName" component={ClientRegKey} />
        <Route path="/clientconfig/setting/:grMenuId/:grMenuName" component={ClientConfSettingManage} />
        <Route path="/clientconfig/host/:grMenuId/:grMenuName" component={ClientHostNameManage} />
        <Route path="/clientconfig/update/:grMenuId/:grMenuName" component={ClientUpdateServerManage} />

        <Route path="/package/packagemanage/:grMenuId/:grMenuName" component={PackageManage} />
        <Route path="/clientconfig/profileset/:grMenuId/:grMenuName" component={ClientProfileSet} />
        
        <Route path="/user/usermastermanage/:grMenuId/:grMenuName" component={UserMasterManage} />
        <Route path="/user/userreqmanage/:grMenuId/:grMenuName" component={UserReqManage} />

        <Route path="/userconfig/media/:grMenuId/:grMenuName" component={MediaRuleManage} />
        <Route path="/userconfig/browser/:grMenuId/:grMenuName" component={BrowserRuleManage} />
        <Route path="/userconfig/security/:grMenuId/:grMenuName" component={SecurityRuleManage} />
        <Route path="/userconfig/swfilter/:grMenuId/:grMenuName" component={SoftwareFilterManage} />
        <Route path="/userconfig/ctrlcenteritem/:grMenuId/:grMenuName" component={CtrlCenterItemManage} />
        <Route path="/userconfig/policykit/:grMenuId/:grMenuName" component={PolicyKitRuleManage} />
        
        <Route path="/desktopconfig/desktopapp/:grMenuId/:grMenuName" component={DesktopAppManage} />
        <Route path="/desktopconfig/desktopconf/:grMenuId/:grMenuName" component={DesktopConfManage} />
        <Route path="/system/cloudservicemng/:grMenuId/:grMenuName" component={GcspManage} />
        <Route path="/system/thememng/:grMenuId/:grMenuName" component={ThemeManage} />

        <Route path="/notices/noticemanage/:grMenuId/:grMenuName" component={NoticeMasterManage} />

        <Route path="/jobs/jobmanage/:grMenuId/:grMenuName" component={JobManage} />
        {window.usePortable ?
        <Switch>
          <Route path="/portable/admin/bulk/:grMenuId/:grMenuName" component={PortableBulkManage} />
          <Route path="/portable/admin/apply/:grMenuId/:grMenuName" component={PortableApplyManage} />
          <Route path="/portable/admin/image/:grMenuId/:grMenuName" component={PortableImageManage} />
        </Switch>
          : null
        }
      </Switch>
    )
  }

  renderPart = () => {
    return (
      <div>
        {window.roleClientAdmin === 1 ?
          <Switch>
            <Route path="/clients/clientmastermanage/:grMenuId/:grMenuName" component={ClientMasterManage} />
            <Route path="/clientconfig/setting/:grMenuId/:grMenuName" component={ClientConfSettingManage} />
          </Switch>
          : null
        }
        {window.roleUserAdmin === 1 ?
          <Switch>
            <Route path="/user/usermastermanage/:grMenuId/:grMenuName" component={UserMasterManage} />
            <Route path="/user/userreqmanage/:grMenuId/:grMenuName" component={UserReqManage} />
          </Switch>
        : null
        }
        { window.roleClientAdmin === 1 || window.roleUserAdmin ?
          <Switch>
            <Route path="/userconfig/media/:grMenuId/:grMenuName" component={MediaRuleManage} />
            <Route path="/userconfig/browser/:grMenuId/:grMenuName" component={BrowserRuleManage} />
            <Route path="/userconfig/security/:grMenuId/:grMenuName" component={SecurityRuleManage} />
            <Route path="/userconfig/swfilter/:grMenuId/:grMenuName" component={SoftwareFilterManage} />
            <Route path="/userconfig/ctrlcenteritem/:grMenuId/:grMenuName" component={CtrlCenterItemManage} />
            <Route path="/userconfig/policykit/:grMenuId/:grMenuName" component={PolicyKitRuleManage} />
          </Switch>
        : null
        }
        {window.roleDesktopAdmin === 1 ?
          <Switch>
            <Route path="/desktopconfig/desktopapp/:grMenuId/:grMenuName" component={DesktopAppManage} />
            <Route path="/desktopconfig/desktopconf/:grMenuId/:grMenuName" component={DesktopConfManage} />
            <Route path="/system/cloudservicemng/:grMenuId/:grMenuName" component={GcspManage} />
            <Route path="/system/thememng/:grMenuId/:grMenuName" component={ThemeManage} />
          </Switch>
        : null
        }
        {window.roleNoticeAdmin === 1 ?
          <Switch>
            <Route path="/notices/noticemanage/:grMenuId/:grMenuName" component={NoticeMasterManage} />
          </Switch>
        : null
        }
        {window.rolePortableAdmin === 1 ?
          <Switch>
            <Route path="/portable/admin/bulk/:grMenuId/:grMenuName" component={PortableBulkManage} />
            <Route path="/portable/admin/apply/:grMenuId/:grMenuName" component={PortableApplyManage} />
            <Route path="/portable/admin/image/:grMenuId/:grMenuName" component={PortableImageManage} />
          </Switch>
        : <Route path="/jobs/jobmanage/:grMenuId/:grMenuName" component={JobManage} />
        }
      </div>
    )
  }

  renderUser = () => {
    return (
      <div>
        <Switch>
          <Route path="/portable/client/apply/:grMenuId/:grMenuName" component={PortableUserApply} />
          <Route path="/portable/client/list/:grMenuId/:grMenuName" component={PortableUserReview} />
        </Switch>
      </div>
    )
  }

  renderRouterState = () => {
    switch (window.gpmsain) {
      case Constants.SUPER_RULECODE:
        return this.renderSuper();
      case Constants.ADMIN_RULECODE:
        return this.renderAdmin();
      case Constants.PART_RULECODE:
        return this.renderPart();
      case Constants.USER_RULECODE:
        return this.renderUser();
    }
  }

  render() {
    const { classes } = this.props;
    const mainPage = this.getBasename();

    return (
      <div className={classes.menuRoot}>
        <Switch>
          <Route exact path="/" name="Home" component={mainPage} />
          {this.renderRouterState()}
        </Switch>
      </div>
    );
  }
}

export default withStyles(GRCommonStyle)(GRRouters);

