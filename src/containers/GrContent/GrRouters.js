import React, { Component } from "react";
import PropTypes from "prop-types";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "containers/Dashboard/";
// Client - client management
import ClientMasterManage from "views/Client/ClientMasterManage";

import ClientManage from "views/Client/ClientManage";
import ClientGroupManage from "views/ClientGroup/ClientGroupManage";

import ClientRegKey from "views/ClientConfig/ClientRegKey";
import ClientProfileSet from "views/ClientConfig/ClientProfileSet";

import ClientConfSetting from "views/Rules/ClientConfig/ClientConfSetting";
import ClientHostNameManage from "views/Rules/HostName/ClientHostNameManage";
import ClientUpdateServerManage from "views/Rules/UpdateServer/ClientUpdateServerManage";

import MediaRuleManage from "views/Rules/UserConfig/MediaRuleManage";
import BrowserRuleManage from "views/Rules/UserConfig/BrowserRuleManage";
import SecurityRuleManage from "views/Rules/UserConfig/SecurityRuleManage";

import JobManage from "views/Job/JobManage";
import PackageManage from 'views/Package/PackageManage';

import DeptManage from "views/User/DeptManage";
import UserManage from "views/User/UserManage";

import DesktopAppManage from "views/Desktop/DesktopAppManage";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import ComponentTests from "views/Test/ComponentTests";


class GrRouters extends Component {
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
          <Route path="/clients/clientmanage/:grMenuId/:grMenuName" component={ClientManage} />
          <Route path="/clients/clientgroupmanage/:grMenuId/:grMenuName" component={ClientGroupManage} />
          <Route path="/clientconfig/regkey/:grMenuId/:grMenuName" component={ClientRegKey} />
          <Route path="/clientconfig/profileset/:grMenuId/:grMenuName" component={ClientProfileSet} />
          <Route path="/clientconfig/setting/:grMenuId/:grMenuName" component={ClientConfSetting} />
          <Route path="/clientconfig/host/:grMenuId/:grMenuName" component={ClientHostNameManage} />
          <Route path="/clientconfig/update/:grMenuId/:grMenuName" component={ClientUpdateServerManage} />
          <Route path="/userconfig/media/:grMenuId/:grMenuName" component={MediaRuleManage} />
          <Route path="/userconfig/browser/:grMenuId/:grMenuName" component={BrowserRuleManage} />
          <Route path="/userconfig/security/:grMenuId/:grMenuName" component={SecurityRuleManage} />
          <Route path="/jobs/jobmanage/:grMenuId/:grMenuName" component={JobManage} />
          <Route path="/package/packagemanage/:grMenuId/:grMenuName" component={PackageManage} />
          <Route path="/user/deptmanage/:grMenuId/:grMenuName" component={DeptManage} />
          <Route path="/user/usermanage/:grMenuId/:grMenuName" component={UserManage} />

          <Route path="/desktopconfig/desktopapp/:grMenuId/:grMenuName" component={DesktopAppManage} />

          <Route path="/test/components/:grMenuId/:grMenuName" component={ComponentTests} />
        </Switch>
      </div>
    );
  }
}

export default withStyles(GrCommonStyle)(GrRouters);

