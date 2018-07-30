import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GrFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return <div className={classes.menuFooterRoot}>@ GPMS - Gooroom Platform Management System.</div>;
  }
}

export default withStyles(GrCommonStyle)(GrFooter);
