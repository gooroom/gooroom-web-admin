import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }


  render() {

    return (
      <React.Fragment>
        <div><h1>Login Page</h1></div>
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(Login);
