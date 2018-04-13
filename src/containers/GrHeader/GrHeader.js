import React, { Component } from "react";
import PropTypes from "prop-types";
import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColors } from "../../templates/default/GrColors";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";

const rootClass = css({
  display: "flex",
  flexDirection: "row",
  zIndex: 1300,
  position: "fixed",
  height: grLayout.headerHeight,
  padding: 0,
  margin: 0,
  boxShadow: "none !important",
  color: "white"
}).toString();

const toolBarClass = css({
  color: "white",
  flexDirection: "row",
  minHeight: grLayout.headerHeight
}).toString();

const brandLogoClass = css({
  color: "white !important",
  width: "calc(" + grLayout.sideBarWidth + " - 24px)",
  paddingLeft: 0,
  paddingRight: 0
}).toString();

class GrHeader extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  render() {
    return (
      <AppBar className={rootClass}>
        <Toolbar className={toolBarClass}>
          <Typography type="title" className={brandLogoClass}>
            GPMS v2.0
          </Typography>
          <IconButton onClick={this.props.toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={this.props.login}>
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

export default GrHeader;
