import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "../Dashboard/";
// Client - client management
import ClientManage from "../../views/Client/ClientManage";
import ClientGroupManage from "../../views/ClientGroup/ClientGroupManage";
import JobManage from "../../views/Job/JobManage";
import DeptManage from "../../views/User/DeptManage";
import PackageManage from '../../views/Package/PackageManage';

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

class GrContainer extends Component {
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
            path="/clients/clientgroupmanage"
            name="ClientGroupManage"
            component={ClientGroupManage}
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
        </Switch>
      </div>
    );
  }
}

export default GrContainer;
