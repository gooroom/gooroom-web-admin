import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";



import GrHeader from "../Header/";
import GrFooter from "../Footer/";
import GrSideMenu from "../GrSideMenu";
import GrBreadcrumb from "../Breadcrumb/";

import GrContainer from "../Container/";
import Aside from "../Aside/";


import blue from 'material-ui/colors/blue';


const theme = createMuiTheme({
  palette: {
  },
  overrides: {
    MuiPaper: {
      root: {
        background: "#E0E0E0",
        color: "#3c50c1",
      }
    }
  },
});

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
//    this.changeTempValue = this.changeTempValue.bind(this);
  }

  // changeTempValue() {
  //   console.log(this.state.tempValue);
  //   this.setState({
  //     tempValue: "zzz"
  //   });
  // }

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen,
      isMainWide: !this.state.isMainWide,
    });
  }

  render() {
    //console.log(this.props);
    const { classes } = this.props;

    return (

      <React.Fragment>
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root} >
        <GrHeader toggleDrawer={this.toggleDrawer} />
        <div className={classes.appBody}>
          <GrSideMenu sideOpen={this.state.sideOpen} />
          <main className={classNames({[classes.main]: !this.state.isMainWide}, {[classes.mainWide]: this.state.isMainWide})}>
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

// Full.propTypes = {
//   classes: PropTypes.object.isRequired,
// };
export default withStyles(styles)(Full);


