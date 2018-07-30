import React, { Component } from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


class GrPane extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.menuBodyRoot}>
        {this.props.children}
      </Paper>
    );
  }
}

export default withStyles(GrCommonStyle)(GrPane);
