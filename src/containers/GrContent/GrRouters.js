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

import JobManage from "views/Job/JobManage";
import PackageManage from 'views/Package/PackageManage';

import DeptManage from "views/User/DeptManage";
import UserManage from "views/User/UserManage";

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
          <Route
            path="/clients/clientmanage/:grMenuId"
            name="ClientManage"
            component={ClientManage}
          />
          <Route
            path="/clients/clientmastermanage/:grMenuId"
            name="ClientMasterManage"
            component={ClientMasterManage}
          />
          <Route 
            path="/clients/clientgroupmanage/:grMenuId"
            name="ClientGroupManage"
            component={ClientGroupManage}
          />
          <Route
            path="/clientconfig/regkey/:grMenuId"
            name="ClientRegKey"
            component={ClientRegKey}
          />
          <Route
            path="/clientconfig/profileset/:grMenuId"
            name="ClientProfileSet"
            component={ClientProfileSet}
          />
          <Route
            path="/clientconfig/setting/:grMenuId"
            name="ClientConfSetting"
            component={ClientConfSetting}
          />
          <Route
            path="/clientconfig/host/:grMenuId"
            name="ClientHostNameManage"
            component={ClientHostNameManage}
          />
          <Route
            path="/clientconfig/update/:grMenuId"
            name="ClientUpdateServerManage"
            component={ClientUpdateServerManage}
          />
          <Route
            path="/jobs/jobmanage/:grMenuId"
            name="JobManage"
            component={JobManage}
          />
          <Route
            path="/user/department/:grMenuId"
            name="DeptManage"
            component={DeptManage}
          />
          <Route
            path="/package/packagemanage/:grMenuId"
            name="PackageManage"
            component={PackageManage}
          />
          <Route
            path="/user/deptmanage/:grMenuId"
            name="DeptManage"
            component={DeptManage}
          />
          <Route
            path="/user/usermanage/:grMenuId"
            name="UserManage"
            component={UserManage}
          />
          <Route
            path="/test/components/:grMenuId"
            name="ComponentTests"
            component={ComponentTests}
          />
        </Switch>
      </div>
    );
  }
}

export default withStyles(GrCommonStyle)(GrRouters);

