import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// Import Main styles for this application
import './scss/main.scss'

// Containers
import GrFull from './containers/GrFull/'

ReactDOM.render(
  <HashRouter>
    <Switch>

      {/* list up another pages like 404, 500 error pages. */}

      <Route path="/" name="Home" component={GrFull} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
