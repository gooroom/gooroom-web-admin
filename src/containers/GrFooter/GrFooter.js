import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from 'glamor';

import { grLayout } from "templates/default/GrLayout";
import { grColors } from "templates/default/GrColors"

const rootClass = css({
  transition: "left 0.25s, right 0.25s, width 0.25s",
  borderBottom: "1px solid #a4b7c1",
  textAlign: "right",
  padding: "0.5rem 1rem",
  height: grLayout.footerHeight,
  alignItems: "center",
  borderTop: "1px solid #a4b7c1",
}).toString();

class GrFooter extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return <div className={rootClass}>@ GPMS - Gooroom Platform Management System.</div>;
  }
}

export default GrFooter;

