import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import { Provider } from 'react-redux';

// Import Main styles for this application
// import './scss/main.scss'

// Containers
import App from './App';

const Root = () => (
  <BrowserRouter>
      <App/>
  </BrowserRouter>
);

export default Root;
