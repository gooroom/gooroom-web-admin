import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// Containers
import GRFull from 'containers/GRFull/'

class App extends Component {
    render() {
        return (
            <div>
                <Route path="/" component={GRFull}/>
            </div>
        );
    }
}

export default App;

