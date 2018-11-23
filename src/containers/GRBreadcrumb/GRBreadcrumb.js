import React, { Component } from "react";
import PropTypes from "prop-types";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import menuItems from "containers/GRSideMenu/GRMenuItems";
import { ListItemSecondaryAction } from "@material-ui/core";

class GRBreadcrumb extends Component {

  constructor(props) {
    super(props);
  }

  getPathTitle = (items, pathname, foldername) => {
    
    if(items) {
      for(let i = 0; i < items.length; i++) {
        if(items[i].url === pathname) {
          return foldername + ':' + items[i].name;
        } else {
          let name = null;
          if(items[i].children && items[i].children.length > 0) {
            name = this.getPathTitle(items[i].children, pathname, foldername + ':' + items[i].name);
          }
          if(name) {
            return name;
          }
        }
      }
    }    
  }

  render() {
    const { classes, pathname } = this.props;
    const pathTitle = this.getPathTitle(menuItems.items, pathname, 'home');
    return (
      <div>
        <ol className={classes.breadcrumbRoot}>
        {pathTitle && pathTitle.split(':').map((m) => (
          <li key={m} className={classes.breadcrumbCurrentMenu}>
          {(m == 'home') && m}
          {(m != 'home') && <span style={{padding:'0px 4px'}}>> {m}</span>}
          </li>
        ))}
        </ol>
      </div>
    );
  }
}

export default withStyles(GRCommonStyle)(GRBreadcrumb);
