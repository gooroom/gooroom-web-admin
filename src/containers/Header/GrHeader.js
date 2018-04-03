import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColors } from "../../templates/default/GrColors"

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";

const styles = {
  root: {
    display: "flex",
    flexDirection: "row",
    background: grColors.headerBackgroundColor,
    zIndex: 2100,
    position: "fixed",
    height: grLayout.headerHeight,
    padding: 0,
    margin: 0,  
  },
  rootToolBar: {
    flexDirection: "row",
    minHeight: grLayout.headerHeight,
  },
  brandLogo: {
    color: grColors.logo,
    width: "calc(" + grLayout.sideBarWidth + " - 24px)",
    paddingLeft: 0,
    paddingRight: 0,
  }
};

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
      <AppBar className={classes.root}>
        <Toolbar className={classes.rootToolBar}>
          <Typography type="title" color="inherit" className={classes.brandLogo}>
            GPMS v2.0
          </Typography>
          <IconButton color="default" onClick={this.props.toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <div>
            <IconButton color="default" onClick={this.props.login}>
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

GrHeader.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(GrHeader);


