import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import GrHeader from "../Header/";
import Sidebar from "../Sidebar/";
import Breadcrumb from "../Breadcrumb/";
import Container from "../Container/";
import Aside from "../Aside/";
import Footer from "../Footer/";
import Dashboard from "../Dashboard/";


import GrSideMenu from "../GrSideMenu";



import Button from 'material-ui/Button';


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
      <div className="app">

        <GrHeader toggleDrawer={this.toggleDrawer} />

        <div className="app-body">
          <GrSideMenu sideOpen={this.state.sideOpen} />
        </div>
        
        <div className="app-body">
          <Sidebar {...this.props} />
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
          <Aside />
        </div>

        <Footer />
      </div>
    );
  }
}

export default Full;
