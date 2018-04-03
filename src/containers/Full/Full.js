import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import { Switch, Route, Redirect } from "react-router-dom";

import GrHeader from "../Header/";
import GrSideMenu from "../GrSideMenu";
import GrBreadcrumb from "../Breadcrumb/";

import Button from "material-ui/Button";

import Sidebar from "../Sidebar/";

import Container from "../Container/";
import Aside from "../Aside/";
import Footer from "../Footer/";
import Dashboard from "../Dashboard/";


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
    background: 'linear-gradient(45deg, #feb26b 30%, #ffd753 90%)',
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
    this.changeTempValue = this.changeTempValue.bind(this);
  }

  changeTempValue() {
    console.log(this.state.tempValue);
    this.setState({
      tempValue: "zzz"
    });
  }

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
      <div className={classes.root} >
        <GrHeader toggleDrawer={this.toggleDrawer} />
        <div className={classes.appBody}>
          <GrSideMenu sideOpen={this.state.sideOpen} />
          <main className={classNames({[classes.main]: !this.state.isMainWide}, {[classes.mainWide]: this.state.isMainWide})}>
            <GrBreadcrumb />
            <Container fluid>
              <Switch>
                <Route
                  path="/dashboard"
                  name="Dashboard"
                  component={Dashboard}
                />
              </Switch>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}

Full.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Full);


