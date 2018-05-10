import React, { Component } from "react";
import PropTypes from "prop-types";

import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

const rootClass = css({
  transition: "left 0.25s, right 0.25s, width 0.25s",
  position: "relative",
  borderBottom: "1px solid #a4b7c1",
  display: "flex",
  flexWrap: "wrap",
  padding: "0.75rem 1rem",
  marginTop: 0,
  marginBottom: 0,
  listStyle: "none",
  height: grLayout.breadcrumbHeight,
  alignItems: "center"
}).toString();

const parentMenuClass = css({
  color: "blue"
}).toString();

const selectMenuClass = css({
  color: "red"
}).toString();

class GrBreadcrumb extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <ol className={rootClass}>
          <li className={parentMenuClass}>
            <a href="#/">Home</a> >
          </li>
          <li className={parentMenuClass}>
            <a href="#/clients">메뉴1(임시)</a> >
          </li>
          <li className={selectMenuClass}>메뉴2(임시)</li>
        </ol>
      </div>
    );
  }
}

export default GrBreadcrumb;
