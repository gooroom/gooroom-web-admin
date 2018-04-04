import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";

const styles = {
  root: {
    transition: "left 0.25s, right 0.25s, width 0.25s",
    position: "relative",
    borderBottom: "1px solid #a4b7c1",
    display: "flex",
    flexWrap: "wrap",
    padding: "0.75rem 1rem",
    marginTop: 0,
    listStyle: "none",
    backgroundColor: "#fff",
    height: grLayout.breadcrumbHeight,
    alignItems: "center"
  }
};

class GrContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
        <div className="container-fluid">gr-container2</div>
    );
  }
}

GrContainer.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(GrContainer);
