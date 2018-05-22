import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from "glamor";
import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { createMuiTheme } from '@material-ui/core/styles';

import Paper from "@material-ui/core/Paper";

const theme = createMuiTheme();

const paneClass = css({
  marginLeft: 20,
  marginRight: 20,
  boxShadow: "none !important",
  backgroundColor: theme.palette.background.default + " !important",
}).toString();

class GrPane extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <Paper className={paneClass}>
        {this.props.children}
      </Paper>
    );
  }
}

export default GrPane;
