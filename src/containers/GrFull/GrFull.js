import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import GrAlert from "components/GrComponents/GrAlert";

import GrHeader from "containers/GrHeader/";
import GrFooter from "containers/GrFooter/";
import GrSideMenu from "containers/GrSideMenu";
import GrBreadcrumb from "containers/GrBreadcrumb/";

import GrRouters from "containers/GrContent/";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


class Full extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sideOpen: true,
      isMainWide: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen,
      isMainWide: !this.state.isMainWide,
    });
  }

  render() {
    const { classes } = this.props;

    return (

      <div>
        <CssBaseline />
          <div className={classes.fullRoot} >
            <GrHeader toggleDrawer={this.toggleDrawer} />
            <GrAlert />
            <div className={classes.appBody}>
              <GrSideMenu sideOpen={this.state.sideOpen} />
              <main className={classNames({[classes.fullMain]: !this.state.isMainWide}, {[classes.fullWideMain]: this.state.isMainWide})}>
                <div>
                  <GrBreadcrumb />
                  <GrRouters />
                </div>
                <GrFooter />
              </main>
            </div>
          </div>
      </div>

    );
  }
}

export default withStyles(GrCommonStyle)(Full);

