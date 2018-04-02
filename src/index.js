import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// Import Main styles for this application
import './scss/main.scss'

// Containers
<<<<<<< HEAD
import GrFull from './containers/Full/'
=======
import Full from './containers/Full/'
import GrSideMenu from './containers/GrSideMenu/'
>>>>>>> 3715f199738fbcd32b87da8d31efb022c66364e1

ReactDOM.render(
  <HashRouter>
    <Switch>

    
      <Route path="/" name="Home" component={GrFull} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
