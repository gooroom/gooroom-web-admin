import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';

const MyAwesomeReactComponent = () => (
  <div>
  <RaisedButton label="Default" />
  
  <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />

  </div>
);

export default MyAwesomeReactComponent;
