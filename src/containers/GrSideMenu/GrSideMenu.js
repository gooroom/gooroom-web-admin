import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from 'glamor';

import { BrowserRouter, Route, Link } from 'react-router-dom';

import { grLayout } from "templates/default/GrLayout";
import { grColors } from "templates/default/GrColors";

import Drawer from "@material-ui/core/Drawer";

import Toolbar from "@material-ui/core/Toolbar";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@material-ui/core/Collapse';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Paper from '@material-ui/core/Paper';

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

import menus from "./_nav";


const menuHeaderClass = css({
  textAlign: "left",
  minHeight: grLayout.sideMenuHeaderHeight + " !important",
  paddingTop: "0.5em",
  paddingLeft: "1em",
  borderBottom: "1px solid #a4b7c1",
  backgroundColor: "#8fa5fa !important",
  color: "#a83e2c",
}).toString();

const menuFooterClass = css({
  textAlign: "left",
  minHeight: grLayout.sideMenuFooterHeight + " !important",
  paddingTop: "0.5em",
  paddingLeft: "1em",
  borderTop: "1px solid #a4b7c1",
  borderBottom: "1px solid #a4b7c1",
  backgroundColor: "#8fa5fa",
  color: "#a83e2c",
}).toString();

const menuContainerClass = css({
  top: grLayout.headerHeight + " !important",
  position: "fixed",
  zIndex: 1019,
  width: grLayout.sideBarWidth,
  height: "calc(100vh - " + grLayout.headerHeight + ") !important",
  flex: "0 0 200px",
  order: "-1",
  transition: "margin-left 0.25s, margin-right 0.25s, width 0.25s, flex 0.25s",
  overflowX: "hidden",
  display: "flex",
  flexDirection: "column",
  padding: 0,
}).toString();

const menuContentClass = css({
  position: "relative",
  flex: 1,
  overflowX: "hidden",
  overflowY: "auto",
  width: grLayout.sideBarWidth,
  transition: "width 0.25s",
  display: "block",
  "&::-webkit-scrollbar": {
    position: "absolute",
    width: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    borderRight: "1px solid #1f292e",
    borderLeft: "0px solid #1f292e",
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const menuItemClass = css({
  padding: "3px 10px 3px 10px !important",
  '&:focus': {
    backgroundColor: "#78909C",
    '& $primary, & $icon': {
      color: "#FFFFFF",
    },
  },
}).toString();

const nestedClass = css({
  padding: "3px 10px 3px 30px !important" ,
}).toString();

const iconClass = css({
  margin: 0,
  padding: 0
}).toString();



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
    this.setState({ selectedIndex: item, anchorEl: null });
  };

  handleClick = (id, e) => {
    switch(id) {
      case 'menu1': this.setState({ menu1Open: !this.state.menu1Open }); break;
      case 'menu2': this.setState({ menu2Open: !this.state.menu2Open }); break;
    }
  };

  render() {

    const titleMenu = (item, key) => {
      return (
        <MenuItem key={key} className={menuItem} >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
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
      const menuclass = item.level == 1 ? menuItemClass : nestedClass;
      return (
        <MenuItem key={key} 
          className={menuclass} 
          component={Link}
          to={item.url}>
          <ListItemIcon className={iconClass}>
            <SendIcon />
          </ListItemIcon>
          <Typography variant="button" color="textSecondary">
            {item.name}
          </Typography>
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
        classes={{ paper: menuContainerClass }}
        variant="persistent"
        anchor={this.state.anchor}
        open={this.props.sideOpen}
      >
          <div className={menuContentClass}>
            <Paper className={menuHeaderClass} elevation={0} square={true}>
              <div>SIDE HEADER</div>
            </Paper>
            <MenuList>
            {menuList(menus.items, 0)}
            </MenuList>
          </div>
        <div className={menuFooterClass}>
          <div>SIDE FOOTER</div>
        </div>
      </Drawer>
    );
  }
}

export default GrSideMenu;
