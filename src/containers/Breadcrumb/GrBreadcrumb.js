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
    marginBottom: 0,
    listStyle: "none",
    height: grLayout.breadcrumbHeight,
    alignItems: "center",
  },
  menuParentItem: {
    color: "blue",
  },
  menuSelectItem: {
    color: "red",
  }
};

class GrBreadcrumb extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div >
        <ol className={classes.root}>
            <li className={classes.menuParentItem}>
                <a href="#/">Home</a> > 
            </li>
            <li className={classes.menuParentItem}>
                <a href="#/clients">단말관리</a> > 
            </li>
            <li className={classes.menuSelectItem}>등록관리</li>
        </ol>
    </div>
  )


      ;
  }
}

GrBreadcrumb.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(GrBreadcrumb);
