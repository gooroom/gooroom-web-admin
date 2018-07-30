import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GrBreadcrumb extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ol className={classes.breadcrumbRoot}>
          <li className={classes.breadcrumbParentMenu}>
            <a href="#/">Home</a> >
          </li>
          <li className={classes.breadcrumbParentMenu}>
            <a href="#/clients">메뉴1(임시)</a> >
          </li>
          <li className={classes.breadcrumbCurrentMenu}>메뉴2(임시)</li>
        </ol>
      </div>
    );
  }
}

export default withStyles(GrCommonStyle)(GrBreadcrumb);
