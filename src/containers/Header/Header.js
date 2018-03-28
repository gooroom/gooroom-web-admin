import React, { Component } from "react";

import Navbar from './Navbar';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <div>
        <Navbar />
      </div>
    );
  }
}

export default Header;
