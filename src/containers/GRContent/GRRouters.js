import React, { Component } from "react";
import PropTypes from "prop-types";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "containers/Dashboard/";
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

import JobManage from "views/Job/JobManage";
import PackageManage from 'views/ClientPackage/ClientPackageManage';

import UserMasterManage from "views/User/UserMasterManage";

import AdminUserManage from "views/System/AdminUserManage";
import ServerSiteConfig from "views/System/ServerSiteConfig";
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

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRRouters extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.menuRoot}>
        <Switch>
          
          <Route exact path="/" name="Home" component={Dashboard} />
          <Route path="/dashboard" name="Dashboard" component={Dashboard} />
          
          <Route path="/clients/clientmastermanage/:grMenuId/:grMenuName" component={ClientMasterManage} />

          <Route path="/clientconfig/regkey/:grMenuId/:grMenuName" component={ClientRegKey} />
          <Route path="/clientconfig/profileset/:grMenuId/:grMenuName" component={ClientProfileSet} />
          
          <Route path="/clientconfig/setting/:grMenuId/:grMenuName" component={ClientConfSettingManage} />
          <Route path="/clientconfig/host/:grMenuId/:grMenuName" component={ClientHostNameManage} />
          <Route path="/clientconfig/update/:grMenuId/:grMenuName" component={ClientUpdateServerManage} />
          
          <Route path="/userconfig/media/:grMenuId/:grMenuName" component={MediaRuleManage} />
          <Route path="/userconfig/browser/:grMenuId/:grMenuName" component={BrowserRuleManage} />
          <Route path="/userconfig/security/:grMenuId/:grMenuName" component={SecurityRuleManage} />
          <Route path="/userconfig/swfilter/:grMenuId/:grMenuName" component={SoftwareFilterManage} />
          
          <Route path="/jobs/jobmanage/:grMenuId/:grMenuName" component={JobManage} />
          <Route path="/package/packagemanage/:grMenuId/:grMenuName" component={PackageManage} />
          <Route path="/user/usermastermanage/:grMenuId/:grMenuName" component={UserMasterManage} />

          <Route path="/desktopconfig/desktopapp/:grMenuId/:grMenuName" component={DesktopAppManage} />
          <Route path="/desktopconfig/desktopconf/:grMenuId/:grMenuName" component={DesktopConfManage} />

          <Route path="/system/adminusermng/:grMenuId/:grMenuName" component={AdminUserManage} />
          <Route path="/system/siteconfig/:grMenuId/:grMenuName" component={ServerSiteConfig} />
          <Route path="/system/cloudservicemng/:grMenuId/:grMenuName" component={GcspManage} />
          <Route path="/system/thememng/:grMenuId/:grMenuName" component={ThemeManage} />

          <Route path="/log/secretlog/:grMenuId/:grMenuName" component={SecurityLogManage} />
          <Route path="/log/generallog/:grMenuId/:grMenuName" component={GeneralLogManage} />

          <Route path="/statistic/dailyviolated/:grMenuId/:grMenuName" component={DailyViolatedManage} />
          <Route path="/statistic/dailyconnect/:grMenuId/:grMenuName" component={DailyLoginCountManage} />
          <Route path="/statistic/dailyregist/:grMenuId/:grMenuName" component={DailyClientCountManage} />

          <Route path="/notices/noticemanage/:grMenuId/:grMenuName" component={NoticeMasterManage} />
			    <Route path="/sf/adminmanage/:grMenuId/:grMenuName" component={DividedAdminManage} />

        </Switch>
      </div>
    );
  }
}

export default withStyles(GRCommonStyle)(GRRouters);

