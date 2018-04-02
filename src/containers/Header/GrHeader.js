import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import AccountCircle from "material-ui-icons/AccountCircle";

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: "100%",
    backgroundColor: "white"
  },
  grNavBar: {
    marginTop: 0,
    width: "100%",
    backgroundColor: "white"
  },
  flex: {
    flex: 0.5
  },
  grTitle: {
    width: 240,
    color: "blue"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

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
      <AppBar position="static" elevation={0} className={classes.grNavBar}>
        <Toolbar>
          <Typography className={classes.grTitle} type="title" color="inherit">
            Material-UI Demo App
          </Typography>
          <IconButton
            className={classes.menuButton}
            color="default"
            onClick={this.props.toggleDrawer}
          >
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GrHeader);
