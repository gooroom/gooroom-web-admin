import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

import { Switch, Route, Redirect } from "react-router-dom";
import Dashboard from "../Dashboard/";
// Clients - client management
import ClientManage from '../../views/Clients/ClientManage';
const styles = {
  root: {
    transition: "left 0.25s, right 0.25s, width 0.25s",
    position: "relative",
//    display: "flex",
    flexWrap: "wrap",
//    padding: "0.75rem 1rem",
    overflowX: "hidden",
    overflowY: "auto",
    marginTop: 0,
    height:
      "calc(100vh - " +
      grLayout.headerHeight +
      " - " +
      grLayout.breadcrumbHeight +
      " - " +
      grLayout.footerHeight +
      ")",
  }
};

class GrContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Switch>
          <Route exact path="/" name="Home" component={Dashboard} />
          <Route path="/dashboard" name="Dashboard" component={Dashboard} />
          <Route
            path="/clients/clientmanage"
            name="ClientManage"
            component={ClientManage}
          />
        </Switch>
      </div>
    );
  }
}

GrContainer.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(GrContainer);
