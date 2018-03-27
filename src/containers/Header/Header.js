import React, { Component } from "react";

import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import RaisedButton from "material-ui/RaisedButton";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

import AppBar from "material-ui/AppBar";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import NavigationClose from "material-ui/svg-icons/navigation/close";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

class Login extends Component {

  render() {
    return <FlatButton {...this.props} label="Login" />;
  }
}

const Logged = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    }
    targetOrigin={{ horizontal: "right", vertical: "top" }}
    anchorOrigin={{ horizontal: "right", vertical: "top" }}
  >
    <MenuItem primaryText="Refresh" />
    <MenuItem primaryText="Help" />
    <MenuItem primaryText="Sign out" />
  </IconMenu>
);

Logged.muiName = "IconMenu";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3
    };
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  render() {
    return (
      <MuiThemeProvider>
        <AppBar
          title="Title"
          iconElementLeft={
            <IconButton>
              <NavigationClose />
            </IconButton>
          }
          iconElementRight={this.state.logged ? <Logged /> : <Login />}
        />
        <Toolbar className="gr-header">
          <ToolbarGroup firstChild={true}>
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
              <MenuItem value={1} primaryText="All Broadcasts" />
              <MenuItem value={2} primaryText="All Voice" />
              <MenuItem value={3} primaryText="All Text" />
              <MenuItem value={4} primaryText="Complete Voice" />
              <MenuItem value={5} primaryText="Complete Text" />
              <MenuItem value={6} primaryText="Active Voice" />
              <MenuItem value={7} primaryText="Active Text" />
            </DropDownMenu>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text="Options" />
            <FontIcon className="muidocs-icon-custom-sort" />
            <ToolbarSeparator />
            <RaisedButton label="Create Broadcast" primary={true} />
            <IconMenu
              iconButtonElement={
                <IconButton touch={true}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Download" />
              <MenuItem primaryText="More Info" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
    );
  }
}

export default Header;
