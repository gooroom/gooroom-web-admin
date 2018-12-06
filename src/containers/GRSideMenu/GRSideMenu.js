import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Link } from 'react-router-dom';

import { grLayout } from "templates/default/GRLayout";

import Drawer from "@material-ui/core/Drawer";

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Collapse from '@material-ui/core/Collapse';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import DashboardIcon from '@material-ui/icons/Poll';
import MenuIcon from '@material-ui/icons/Menu';

import DraftsIcon from '@material-ui/icons/Drafts';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import menuItems from "./GRMenuItems";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class GRSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statistic: false
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
    this.setState(state => ({ [id]: !state[id] }));
    switch(id) {
      case 'menu1': this.setState({ menu1Open: !this.state.menu1Open }); break;
      case 'menu2': this.setState({ menu2Open: !this.state.menu2Open }); break;
    }
  };

  render() {

    const { classes } = this.props;

    const titleMenu = (item, key) => {
      return (
        <ListItem key={key} className={menuItem} >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      );
    }

    const menuDivider = (divider, key) => {
      return (<Divider />);
    }

    // nav item with nav link
    const menuItem = (item, key, isDrop) => {
      const menuclass = item.level == 1 ? classes.menuItemClass : classes.nestedClass;
      const icon = (item.id == 'dashboard') ? <DashboardIcon /> : (isDrop) ? <MenuIcon /> : <KeyboardArrowRightIcon />;
      return (
        <ListItem key={key} button className={menuclass} onClick={() => this.handleClick(item.id)}
          component={Link} to={item.url}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText inset primary={item.name} style={{paddingLeft:0}} />
          {(isDrop) &&
            <span>{this.state[item.id] ? <ExpandLess /> : <ExpandMore />}</span>            
          }
        </ListItem>
      )
    };

    // menu dropdown
    const menuDropdown = (item, key) => {
      return (
        <div key={key}>
        {menuItem(item, key, true)}
        <Collapse in={this.state[item.id]} timeout="auto" unmountOnExit>
          <List key={key} component="div" disablePadding>
            {menuList(item.children)}
          </List>
        </Collapse>
        </div>
      );
    };

    // menu type
    const menuType = (item, idx) => {
      return (item.title ? titleMenu(item, idx) :
        item.divider ? menuDivider(item, idx) :
        item.children ? menuDropdown(item, idx) : menuItem(item, idx, false));
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
          <List component="nav" className={classes.root}>
          {menuList(menuItems.items, 0)}
          </List>
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
