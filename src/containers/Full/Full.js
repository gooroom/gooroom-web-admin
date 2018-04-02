import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { Switch, Route, Redirect } from "react-router-dom";
import classNames from "classnames";

import GrHeader from "../Header/";
import GrSideMenu from "../GrSideMenu";
import Button from "material-ui/Button";

import Sidebar from "../Sidebar/";
import Breadcrumb from "../Breadcrumb/";
import Container from "../Container/";
import Aside from "../Aside/";
import Footer from "../Footer/";
import Dashboard from "../Dashboard/";

const styles = {
  appBody: {
    marginTop: 55,
    background: 'linear-gradient(45deg, #feb26b 30%, #ffd753 90%)',
    zIndex: 2100
  }
};

class Full extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sideOpen: true
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen
    });
  }

  render() {
    //console.log(this.props);
    const { classes } = this.props;

    return (
      <div>
        <GrHeader toggleDrawer={this.toggleDrawer} />
        <div className={classes.appBody}>
          
          <GrSideMenu sideOpen={this.state.sideOpen} />
          <main className="main">

            <Breadcrumb />
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

