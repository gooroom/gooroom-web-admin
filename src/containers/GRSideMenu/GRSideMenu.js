import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Link } from 'react-router-dom';

import { grLayout } from "templates/default/GRLayout";

import Drawer from "@material-ui/core/Drawer";

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@material-ui/core/Collapse';

import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import menuItems from "./GRMenuItems";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

    const { classes } = this.props;

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
      const menuclass = item.level == 1 ? classes.menuItemClass : classes.nestedClass;
      const menuIcon = (item.level == 1) ? <ArrowRightIcon /> : <KeyboardArrowRightIcon />

      return (
        <MenuItem key={key} 
          className={menuclass} 
          component={Link}
          to={item.url}>
          <ListItemIcon style={{padding:0,margin:0}} >{menuIcon}</ListItemIcon>
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
        classes={{ paper: classes.menuContainerClass }}
        variant="persistent"
        anchor="left"
        open={this.props.sideOpen}
      >
        <div style={{position: "relative", flex: "1"}}>
          <AppBar position="static" style={{height:grLayout.sideMenuHeaderHeight, backgroundColor:"gray"}}>
            <Toolbar style={{minHeight:"100%"}}>
              <Typography variant="body2" color="inherit" style={{width:'100%',textAlign:'center'}} >
              {/** on.271 / job.12 / df.17 */}
              </Typography>
            </Toolbar>
          </AppBar>
          <MenuList>
          {menuList(menuItems.items, 0)}
          </MenuList>
        </div>
        <AppBar position="static" style={{backgroundColor:"gray"}}>
          <Toolbar>
            <Typography variant="overline" gutterBottom style={{width:'100%',textAlign:'center'}} >
              {/** SIDE FOOTER */}            
            </Typography>
          </Toolbar>
        </AppBar>
      </Drawer>
    );
  }
}

export default withStyles(GRCommonStyle)(GRSideMenu);
