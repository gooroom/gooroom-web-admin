import React, { Component } from "react";
import CssBaseline from 'material-ui/CssBaseline';

import { Switch, Route, Redirect } from "react-router-dom";
import classNames from "classnames";

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import GrHeader from "../Header/";
import Sidebar from "../Sidebar/";
import Breadcrumb from "../Breadcrumb/";
import Container from "../Container/";
import Aside from "../Aside/";
import Footer from "../Footer/";
import Dashboard from "../Dashboard/";

import GrSideMenu from "../GrSideMenu";

import Button from "material-ui/Button";

const theme = createMuiTheme();

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

    return (
      <div>
        <GrHeader toggleDrawer={this.toggleDrawer} />
        <div>
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

export default Full;
