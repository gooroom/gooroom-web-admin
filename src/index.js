import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import App from './App';

import store from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter basename={'gpms'}>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
