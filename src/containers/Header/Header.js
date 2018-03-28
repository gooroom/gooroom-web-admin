import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  render() {
    
    return (
        <header className="app-header">
          header
        </header>
    );
  }
}

export default Header;
