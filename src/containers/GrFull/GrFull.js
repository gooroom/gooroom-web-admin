import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from 'glamor';

import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import GrHeader from "../GrHeader/";
import GrFooter from "../GrFooter/";
import GrSideMenu from "../GrSideMenu";
import GrBreadcrumb from "../GrBreadcrumb/";

import GrContainer from "../Container/";
import Aside from "../Aside/";


const theme = createMuiTheme({
  palette: {
  },
  overrides: {
  },
});

const rootClass = css({
  minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
}).toString();

const appBodyClass = css({
  marginTop: grLayout.headerHeight,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    overflowX: "hidden",
}).toString();

const mainClass = css({
  marginRight: 0,
    marginLeft: grLayout.sideBarWidth,
    flex: 1,
    zIndex: 1200,
    minWidth: 0,
    transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
    display: "block",
}).toString();

const mainWideClass = css({
  marginRight: 0,
    marginLeft: 0,
    flex: 1,
    zIndex: 1200,
    minWidth: 0,
    transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
    display: "block",
}).toString();

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  appBody: {
    marginTop: grLayout.headerHeight,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    overflowX: "hidden",
  },
  main: {
    marginRight: 0,
    marginLeft: grLayout.sideBarWidth,
    flex: 1,
    zIndex: 1200,
    minWidth: 0,
    transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
    display: "block",
  },
  mainWide: {
    marginRight: 0,
    marginLeft: 0,
    flex: 1,
    zIndex: 1200,
    minWidth: 0,
    transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
    display: "block",
  }

};

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

    return (

      <React.Fragment>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={rootClass} >
        <GrHeader toggleDrawer={this.toggleDrawer} />
        <div className={appBodyClass}>
          <GrSideMenu sideOpen={this.state.sideOpen} />
          <main className={classNames({[mainClass]: !this.state.isMainWide}, {[mainWideClass]: this.state.isMainWide})}>
            <div>
            <GrBreadcrumb />
            <GrContainer />
            </div>
            <GrFooter />
            </main>
          </div>
      </div>
      </MuiThemeProvider>
      </React.Fragment>

    );
  }
}

export default Full;
