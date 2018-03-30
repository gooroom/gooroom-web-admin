import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Header from "../Header/";
import Sidebar from "../Sidebar/";
import Breadcrumb from "../Breadcrumb/";
import Container from "../Container/";
import Aside from "../Aside/";
import Footer from "../Footer/";
import Dashboard from "../Dashboard/";

class Full extends Component {

  render() {

    return (
      <div className="app">
        <Header />
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
