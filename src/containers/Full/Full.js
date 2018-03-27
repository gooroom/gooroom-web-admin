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
      <div className="gr-app">
        <Header />
        <div className="gr-app-body">
          <Sidebar {...this.props} />
          <main className="gr-main">
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
