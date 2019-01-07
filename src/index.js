import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from "react-i18next";

import i18n from "./ui/i18n";
import App from './App';

import store from './store';
import { Provider } from 'react-redux';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
  <Provider store={store}>
    <HashRouter basename={'gpms'}>
      <App />
    </HashRouter>
  </Provider>
  </I18nextProvider>,
  document.getElementById('root')
);
