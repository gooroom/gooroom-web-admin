import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from 'glamor';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import { Switch, Route, Redirect } from "react-router-dom";

import Dashboard from "../Dashboard/";
// Clients - client management
import ClientManage from '../../views/Clients/ClientManage';
import JobManage from '../../views/Jobs/JobManage';


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
            path="/jobs/jobmanage"
            name="JobManage"
            component={JobManage}
          />
        </Switch>
      </div>
    );
  }
}

export default GrContainer;
