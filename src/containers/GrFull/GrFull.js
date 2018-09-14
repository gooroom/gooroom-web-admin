import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import GrAlert from "components/GrComponents/GrAlert";

import GrHeader from "containers/GrHeader/";
import GrFooter from "containers/GrFooter/";
import GrSideMenu from "containers/GrSideMenu";
import GrBreadcrumb from "containers/GrBreadcrumb/";

import GrRouters from "containers/GrContent/";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

const theme = createMuiTheme({
  overrides: {
    // Name of the component ⚛️ / style sheet
    MuiButton: {
      // Name of the rule
      sizeSmall: {
        padding: 0
      },
    },
  },
});

class Full extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sideOpen: true,
      isMainWide: false,
      rightDrawer: false,
      popMenu: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen,
      isMainWide: !this.state.isMainWide
    });
  }

  toggleRightDrawer = (side, open) => () => {
    console.log('side : ', side);
    console.log('open : ', open);
    this.setState({
      [side]: open
    });
  };

  handleClickAdmin = () => {
    console.log("handleClickAdmin...........");
    this.setState({
      rightDrawer: true,
    });
  }

  handleClickSystem = () => {
    console.log("handleClickSystem...........");
    this.setState(state => ({ popMenu: !state.popMenu }));
  }

  render() {
    const { classes } = this.props;

    const sideList = (
      <div > ..........RIGHT SIDE......... </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
      <div>
        <CssBaseline />
          <div className={classes.fullRoot} >
            <GrHeader toggleDrawer={this.toggleDrawer} onAdminClick={this.handleClickAdmin} onSystemClick={this.handleClickSystem} />
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

      <Drawer anchor="right" open={this.state.rightDrawer} onClose={this.toggleRightDrawer('rightDrawer', false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleRightDrawer('rightDrawer', false)}
          onKeyDown={this.toggleRightDrawer('rightDrawer', false)}
        >
          {sideList}
        </div>
      </Drawer>
        
      </MuiThemeProvider>

    );
  }
}

export default withStyles(GrCommonStyle)(Full);

