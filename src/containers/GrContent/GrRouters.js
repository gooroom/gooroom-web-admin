import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "../Dashboard/";
// Client - client management
import ClientMasterManage from "../../views/Client/ClientMasterManage";

import ClientManage from "../../views/Client/ClientManage";
import ClientGroupManage from "../../views/ClientGroup/ClientGroupManage";

import ClientRegKey from "../../views/ClientConfig/ClientRegKey";
import ClientProfileSet from "../../views/ClientConfig/ClientProfileSet";

import ClientConfSetting from "../../views/ClientConfig/ClientConfSetting";
import ClientHostNameManage from "../../views/ClientConfig/ClientHostNameManage";
import ClientUpdateServerManage from "../../views/ClientConfig/ClientUpdateServerManage";

import JobManage from "../../views/Job/JobManage";
import PackageManage from '../../views/Package/PackageManage';

import DeptManage from "../../views/User/DeptManage";
import UserManage from "../../views/User/UserManage";



import ComponentTests from "../../views/Test/ComponentTests";


const rootClass = css({
  transition: "left 0.25s, right 0.25s, width 0.25s",
  position: "relative",
  flexWrap: "wrap",
  overflowX: "hidden",
  overflowY: "auto",
  marginTop: 0,
  height:
    "calc(100vh - " +
    grLayout.headerHeight +
    " - " +
    grLayout.breadcrumbHeight +
    " - " +
    grLayout.footerHeight +
    ")",
}).toString();

class GrRouters extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={rootClass}>
        <Switch>
          <Route exact path="/" name="Home" component={Dashboard} />
          <Route path="/dashboard" name="Dashboard" component={Dashboard} />
          <Route
            path="/clients/clientmanage"
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
            path="/clientconfig/regkey"
            name="ClientRegKey"
            component={ClientRegKey}
          />
          <Route
            path="/clientconfig/profileset"
            name="ClientProfileSet"
            component={ClientProfileSet}
          />
          <Route
            path="/clientconfig/setting"
            name="ClientConfSetting"
            component={ClientConfSetting}
          />
          <Route
            path="/clientconfig/host"
            name="ClientHostNameManage"
            component={ClientHostNameManage}
          />
          <Route
            path="/clientconfig/update"
            name="ClientUpdateServerManage"
            component={ClientUpdateServerManage}
          />
          <Route
            path="/jobs/jobmanage"
            name="JobManage"
            component={JobManage}
          />
          <Route
            path="/user/department"
            name="DeptManage"
            component={DeptManage}
          />
          <Route
            path="/package/packagemanage"
            name="PackageManage"
            component={PackageManage}
          />
          <Route
            path="/user/deptmanage"
            name="DeptManage"
            component={DeptManage}
          />
          <Route
            path="/user/usermanage"
            name="UserManage"
            component={UserManage}
          />
          <Route
            path="/test/components"
            name="ComponentTests"
            component={ComponentTests}
          />
        </Switch>
      </div>
    );
  }
}

export default GrRouters;
