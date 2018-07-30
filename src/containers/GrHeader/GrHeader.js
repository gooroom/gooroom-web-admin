import React, { Component } from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GrHeader extends Component {
  constructor(props) {
    super(props);
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  render() {
    const { classes } = this.props;

    return (
      <AppBar className={classes.headerRoot}>
        <Toolbar className={classes.headerToolbar}>
          <Typography type="title" className={classes.headerBrandLogo}>
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

export default withStyles(GrCommonStyle)(GrHeader);
