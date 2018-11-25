import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
// Containers
import GRFull from 'containers/GRFull/'
import Login from 'ui/login/Login';

import { Home, About } from 'pages';



class App extends Component {
    render() {
        return (
            <div>
          <Route exact path="/" component={Home}/>
                <Route path="/about/" component={About}/>
                </div>
        );
    }
}

export default App;

