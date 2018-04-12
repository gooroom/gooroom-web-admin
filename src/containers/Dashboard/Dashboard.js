import React, {Component} from 'react';
import {showMe} from '../../components/GrUtils/GrRequester'

class Dashboard extends Component {
    render() {
        const s = showMe();
        return (
          <div className="dashboard">
              dashboard {s}
          </div>
    
        )
    }
}

export default Dashboard;
