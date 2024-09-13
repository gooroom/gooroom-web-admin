import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { GRCommonStyle } from "templates/styles/GRStyles";
import { Grid, Paper, Typography, withStyles } from "@material-ui/core";

import * as AdminActions from "modules/AdminModule";
import * as SecurityLogActions from "modules/SecurityLogModule";
import * as HealthActions from "modules/HealthModule";

import GRPane from "containers/GRContent/GRPane";
import GPMSModuleHealth from "./GPMSModuleStatus";

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

  componentDidMount() {
    this.refreshDashboard();
    this.dashboardTimer = setInterval(()=> this.refreshDashboard(), 1000);
  }

  componentWillUnmount() {
    this.setState({
      isRunningTimer: false,
    });
    clearInterval(this.dashboardTimer);
    this.dashboardTimer = null;
  }

  refreshDashboard() {
    if(this.props.AdminProps.get('pollingCycle') > 4) {
        if(this.state.currentCount < 1) {
            this.setState({
                currentCount: this.props.AdminProps.get('pollingCycle'),
                isRunningTimer: true
            });
            // refresh action to here
            this.props.GPMSHealthActions.getGPMSModuleStatusALL()
        } else {
            const newCount = this.state.currentCount - 1;
            this.setState({
                currentCount: newCount,
                isRunningTimer: true
            });
        }
    }
  }

  render() {
    const {classes} = this.props;

    if (this.state.redirect) {
      if (this.state.linkType == "package") {
        return <Redirect push to="/package/packagemanage/GRM0201/menuPackageManage" />;
      } else if (this.state.linkType == "client") {
        return <Redirect push to="/clients/clientmastermanage/GRM0101/menuClientManage" />;
      } else if (this.state.linkType == "user") {
        return <Redirect push to="/user/usermastermanage/GRM0301/menuUserManage" />;
      }
    }

    return (
      <GRPane>
        <Grid container spacing={24} style={{ marginTop: 20 }}>
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
  AdminProps: state.AdminModule,
  SecurityLogProps: state.SecurityLogModule,
});

const mapDispatchToProps = (dispatch) => ({
  AdminActions: bindActionCreators(AdminActions, dispatch),
  SecurityLogActions: bindActionCreators(SecurityLogActions, dispatch),
  GPMSHealthActions: bindActionCreators(HealthActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ServerDashboard));
