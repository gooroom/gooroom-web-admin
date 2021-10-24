import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import menuItemsSuper from "containers/GRSideMenu/GRMenuItemsSuper";
import menuItemsAdmin from "containers/GRSideMenu/GRMenuItemsAdmin";
import menuItemsPart from "containers/GRSideMenu/GRMenuItemsPart";
import { ListItemSecondaryAction } from "@material-ui/core";
import { translate, Trans } from "react-i18next";

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
    const { t, i18n } = this.props;
    let pathTitle = null;
    if(window.gpmsain === Constants.SUPER_RULECODE) {
      pathTitle = this.getPathTitle(menuItemsSuper.items, pathname, 'home');
    } else if(window.gpmsain === Constants.ADMIN_RULECODE) {
      pathTitle = this.getPathTitle(menuItemsAdmin.items, pathname, 'home');
    } else if(window.gpmsain === Constants.PART_RULECODE) {
      pathTitle = this.getPathTitle(menuItemsPart.items, pathname, 'home');
    }
    
    return (
      <div>
        <ol className={classes.breadcrumbRoot}>
        {pathTitle && pathTitle.split(':').map((m) => (
          <li key={m} className={classes.breadcrumbCurrentMenu}>
          {(m == 'home') && t(m)}
          {(m != 'home') && <span style={{padding:'0px 4px'}}>> {t(m)}</span>}
          </li>
        ))}
        </ol>
      </div>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(GRBreadcrumb));
