import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";

import { BrowserRouter, Route, Link } from 'react-router-dom';

import { grLayout } from "../../templates/default/GrLayout";
import { grColors } from "../../templates/default/GrColors";

import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

import { MenuList, MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';

import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";

import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import DraftsIcon from 'material-ui-icons/Drafts';
import SendIcon from 'material-ui-icons/Send';
import StarBorder from 'material-ui-icons/StarBorder';
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";

import { otherMailFolderListItems } from "./tileData";

import menus from "./_nav";

import InboxIcon from "material-ui-icons/MoveToInbox";

const styles = theme => ({
  docked: {
    position: "fixed",
    zIndex: 1019,
    height: "calc(100vh - " + grLayout.headerHeight + ")",
    flex: "0 0 " + grLayout.sideBarWidth,
    order: -1,
    transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
    display: "flex",
    flexDirection: "column",
    padding: 0,
    color: "#fff",
  },
  paper: {                
    top: 0,
    width: grLayout.sideBarWidth,
    position: "relative",
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    transition: "width 0.25s",
    background: grColors.sideBarBackgroup,
    color: "white",
  },
  menuHeader: {
    minHeight: grLayout.breadcrumbHeight,
    alignItems: "center",
    borderBottom: "1px solid #a4b7c1",
  },
  menuItem: {
    padding: "3px 10px 3px 10px",
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  nested: {
    padding: "3px 10px 3px 30px",
  },
  primary: {
    color: grColors.sideBarMenuText,
  },
  icon: {
    margin: 0,
    padding: 0
  },
});

class GrSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: "left",
      menu1Open: false,
      menu2Open: true,
    };

  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  handleMenuItemClick = (event, item) => {
    console.log(item);
    this.setState({ selectedIndex: item, anchorEl: null });
  };

  handleClick = (id, e) => {
    console.log(id);
    console.log(e);
    switch(id) {
      case 'menu1': this.setState({ menu1Open: !this.state.menu1Open }); break;
      case 'menu2': this.setState({ menu2Open: !this.state.menu2Open }); break;
    }
  };

  render() {
    const props = this.props;
    const {classes} = this.props;

    const titleMenu = (item, key) => {
      return (
        <MenuItem key={key} className={classes.menuItem} >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} primary={item.name} />
        </MenuItem>
      );
    }

    const menuDivider = (divider, key) => {
      return (<Divider />);
    }

    // nav item with nav link
    const menuItem = (item, key) => {
      const classes = {
        item: classNames(item.class) ,
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      };
      return (
        menuLink(item, key, classes)
      )
    };

    // <MenuItem key={key} className={classes.menuItem} onClick={event => this.handleMenuItemClick(event, item)}>
    const menuLink = (item, key, classParam) => {
      const url = item.url ? item.url : '';
      const menuclass = item.level == 1 ? classes.menuItem : classes.nested;
      return (
        <MenuItem key={key} 
          className={menuclass} 
          component={Link}
          to={item.url}>
          <ListItemIcon className={classes.icon}>
            <SendIcon />
          </ListItemIcon>
          <ListItemText className={classes.icon} inset primary={item.name}></ListItemText>
        </MenuItem>
      )
    };

    // menu dropdown
    const menuDropdown = (item, key) => {
      return (
        <div key={key}>
        {menuItem(item, key)}
        <Collapse in={this.state.menu2Open} timeout="auto" unmountOnExit>
          <MenuList component="div" disablePadding>
            {menuList(item.children)}
          </MenuList>
        </Collapse>
        </div>
      );
    };

    // menu type
    const menuType = (item, idx) => {
      return (item.title ? titleMenu(item, idx) :
        item.divider ? menuDivider(item, idx) :
        item.children ? menuDropdown(item, idx) : menuItem(item, idx));
    }

    // menu list
    const menuList = (items) => {
      return items.map((item, index) => menuType(item, index));
    };

    return (
      <Drawer
        classes={{ docked: classes.docked, paper: classes.paper }}
        variant="persistent"
        anchor={this.state.anchor}
        open={this.props.sideOpen}
      >
        <div className={classes.menuHeader}>
          <div>MMMM</div>
        </div>
        
        <Paper>
          <MenuList>
          {menuList(menus.items, 0)}
          </MenuList>
        </Paper>
      </Drawer>
    );
  }
}

GrSideMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};
export default withStyles(styles, { withTheme: true })(GrSideMenu);

// GrSideMenu.propTypes = {
//   children: PropTypes.node,
//   classes: PropTypes.object.isRequired
// };
// export default withStyles(styles)(GrSideMenu);

//export default GrSideMenu;
