import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import compose from "recompose/compose";
import withWidth from "material-ui/utils/withWidth";

import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    zIndex: 2100,
  },
  rootToolBar: {
    minHeight: 55
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
    console.log( classes.root);
    return (
      <AppBar className={classes.root}>
        <Toolbar className={classes.rootToolBar}>
          <Typography type="title" color="inherit">
            Material-UI Demo App
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

// GrHeader.propTypes = {
//   classes: PropTypes.object.isRequired
// };
// export default withStyles(styles)(GrHeader);

//export default GrHeader;

// GrHeader.propTypes = {
//   classes: PropTypes.object.isRequired,
//   width: PropTypes.string.isRequired
// };
// export default compose(withStyles(styles), withWidth())(GrHeader);

GrHeader.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(GrHeader);


