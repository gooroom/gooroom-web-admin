import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";

// Containers
import Full from './containers/Full/'

ReactDOM.render(
  <HashRouter>
    <Switch>
    //   <Route exact path="/login" name="Login Page" component={Login} />
    //   <Route exact path="/register" name="Register Page" component={Register} />
    //   <Route exact path="/404" name="Page 404" component={Page404} />
    //   <Route exact path="/500" name="Page 500" component={Page500} />
      <Route path="/" name="Home" component={Full} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
