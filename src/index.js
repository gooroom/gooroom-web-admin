import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { I18nextProvider } from "react-i18next";

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import i18n from "./ui/i18n";
import App from './App';

import store from './store';
import { Provider } from 'react-redux';

class LocalizedUtils extends MomentUtils {
  getDatePickerHeaderText(date) {
    //return date.locale("ko").format("MMM Do, dddd");
    return date.format("MM / DD, ddd");
  }
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
  <MuiPickersUtilsProvider utils={LocalizedUtils}>
  
  <Provider store={store}>
    <HashRouter basename={'/'}>
      <App />
    </HashRouter>
  </Provider>

  </MuiPickersUtilsProvider>
  </I18nextProvider>,
  document.getElementById('root')
);
