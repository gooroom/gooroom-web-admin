import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class PageTest extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }


  render() {

    return (
      <React.Fragment>
        <div>Page Test</div>
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(PageTest);
