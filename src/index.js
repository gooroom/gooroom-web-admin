import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Root from './Root';
import App from './App';


import store from './store';
import { Provider } from 'react-redux';

// Import Main styles for this application
// import './scss/main.scss'

// Containers
import GRFull from 'containers/GRFull/'
import Login from 'ui/login/Login';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
    <Switch>

      {/* list up another pages like 404, 500 error pages. */}
      
      <Route path="/" name="Home" component={GRFull} />
    </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
