import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Grid, Paper, Typography, withStyles } from "@material-ui/core";
import { GRCommonStyle } from "templates/styles/GRStyles";
import { Grid, Paper, Typography, withStyles } from "@material-ui/core";

import * as AdminActions from "modules/AdminModule";
import * as ResourceMetricsActions from "modules/ResourceMetricsModule";
import * as SecurityLogActions from "modules/SecurityLogModule";
import * as HealthActions from "modules/HealthModule";

import GRPane from "containers/GRContent/GRPane";
import GPMSModuleHealth from "./GPMSModuleStatus";

import GRPane from "containers/GRContent/GRPane";
import GPMSModuleHealth from "./GPMSModuleStatus";
import ResourceMetrics from "./ResourceMetrics";

class ServerDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCount: 0,
      isRunningTimer: false,
      linkType: "",
      redirect: false,
    };
  }

  handleClickChangeResource = (type) => {
    this.props.ResourceMetricsActions.readResourceMetrics({
      resourceType: type,
    });
  };

  componentDidMount() {
    this.refreshDashboard();
    this.handleClickChangeResource("cpu");
    this.dashboardTimer = setInterval(() => this.refreshDashboard(), 1000);
  }

  componentWillUnmount() {
    this.setState({
      isRunningTimer: false,
    });
    clearInterval(this.dashboardTimer);
    this.dashboardTimer = null;
  }

  refreshDashboard() {
    if (this.props.AdminProps.get("pollingCycle") > 4) {
      if (this.state.currentCount < 1) {
        this.setState({
          currentCount: this.props.AdminProps.get("pollingCycle"),
          isRunningTimer: true,
        });
        // refresh action to here
        this.props.GPMSHealthActions.getGPMSModuleStatusALL();
        // -- metric --
        const resourceType = this.props.ResourceMetricsProps.get("resourceType");
        console.log("[Debug Refresh Dashbaord] resourceType : ", resourceType);
        if (resourceType) {
          this.props.ResourceMetricsActions.readResourceMetrics({
            resourceType: resourceType,
          });
        }
      } else {
        const newCount = this.state.currentCount - 1;
        this.setState({
          currentCount: newCount,
          isRunningTimer: true,
        });
      }
    }
  }

  render() {
    const {classes, t} = this.props;

    if (this.state.redirect) {
      if (this.state.linkType == "package") {
        return (
          <Redirect
            push
            to="/package/packagemanage/GRM0201/menuPackageManage"
          />
        );
      } else if (this.state.linkType == "client") {
        return (
          <Redirect
            push
            to="/clients/clientmastermanage/GRM0101/menuClientManage"
          />
        );
      } else if (this.state.linkType == "user") {
        return (
          <Redirect push to="/user/usermastermanage/GRM0301/menuUserManage" />
        );
      }
    }

    // Determine if repo or db servers are present

    return (
      <GRPane>
        <Grid container spacing={24} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={12}>
            <Paper className={classes.paper}>
              <ResourceMetrics
                statusInfo={this.props.ResourceMetricsProps.get("resourceMetricsInfo")}
                onClickChangeType={this.handleClickChangeResource}
                resourceType={this.props.ResourceMetricsProps.get("resourceType")}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <GPMSModuleHealth/>
            </Paper>
          </Grid>
        </Grid>
        <div style={{ marginTop: 20, display: "inline-flex", flex: "1 1 0" }}>
          <span>{this.state.isRunningTimer && <img src="/gpms/images/loading-icon-animated-gif.jpg" width="30" />}</span>
          <span>
            <Typography>{this.state.currentCount}</Typography>
          </span>
        </div>
      </GRPane>
    );
  }
}

const mapStateToProps = (state) => ({
  ResourceMetricsProps: state.ResourceMetricsModule,
  AdminProps: state.AdminModule,
  SecurityLogProps: state.SecurityLogModule,
});

const mapDispatchToProps = (dispatch) => ({
  ResourceMetricsActions: bindActionCreators(ResourceMetricsActions, dispatch),
  AdminActions: bindActionCreators(AdminActions, dispatch),
  SecurityLogActions: bindActionCreators(SecurityLogActions, dispatch),
  GPMSHealthActions: bindActionCreators(HealthActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(GRCommonStyle)(ServerDashboard));
