import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return <div className={classes.menuFooterRoot}>@ GPMS - Gooroom Platform Management System.</div>;
  }
}

export default withStyles(GRCommonStyle)(GRFooter);
