import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// Import Main styles for this application
import './scss/main.scss'

// Containers
import Full from './containers/Full/'
import GrSideMenu from './containers/GrSideMenu/'

ReactDOM.render(
  <HashRouter>
    <Switch>

    
      <Route path="/" name="Home" component={Full} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
