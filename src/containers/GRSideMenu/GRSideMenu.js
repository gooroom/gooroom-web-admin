import React from "react";
import { Map, fromJS } from 'immutable';

import * as Constants from "components/GRComponents/GRConstants";

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

import DashboardIcon from '@material-ui/icons/PollTwoTone';
import ClientIcon from '@material-ui/icons/ComputerTwoTone';
import UserIcon from '@material-ui/icons/SupervisedUserCircleTwoTone';
import JobIcon from '@material-ui/icons/PlayForWorkTwoTone';
import StatisticIcon from '@material-ui/icons/ShowChartTwoTone';
import RuleIcon from '@material-ui/icons/BallotTwoTone';
import SoftwareIcon from '@material-ui/icons/SettingsSystemDaydreamTwoTone';
import DesktopIcon from '@material-ui/icons/CallToActionTwoTone';
import CloudIcon from '@material-ui/icons/CloudTwoTone';

import MenuIcon from '@material-ui/icons/Menu';
import DraftsIcon from '@material-ui/icons/Drafts';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import menuItems from "./GRMenuItems";

import menuItemsSuper from "containers/GRSideMenu/GRMenuItemsSuper";
import menuItemsAdmin from "containers/GRSideMenu/GRMenuItemsAdmin";
import menuItemsPart from "containers/GRSideMenu/GRMenuItemsPart";
import menuItemsUser from "containers/GRSideMenu/GRMenuItemsUser";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


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
    const { t, i18n } = this.props;

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
      return (<Divider key={key} />);
    }

    // nav item with nav link
    const menuItem = (item, key, isDrop) => {
      const menuclass = item.level == 1 ? classes.menuItemClass : (item.level == 2 ? classes.nestedClass : classes.nestedMoreClass);
      const icon = (item.id == 'dashboard') ? <DashboardIcon /> : (item.id == 'statistic') ? <StatisticIcon /> : 
              (item.id == 'clientconfig' || item.id == 'userconfig') ? <RuleIcon /> :
              (item.id == 'desktopconfig') ? <DesktopIcon /> : 
              (item.id == 'package') ? <SoftwareIcon /> : 
              (item.id == 'jobs') ? <JobIcon /> : 
              (item.id == 'user') ? <UserIcon /> : 
              (item.id == 'clients') ? <ClientIcon /> : 
              (item.id == 'portable') ? <CloudIcon /> :
              (isDrop) ? <MenuIcon /> : <KeyboardArrowRightIcon />;
      return (
        <ListItem key={key} button className={menuclass} onClick={() => this.handleClick(item.id)}
          component={(isDrop) ? '' : Link} to={(isDrop) ? '' : item.url}>
          <ListItemIcon >{icon}</ListItemIcon>
          <ListItemText inset primary={t(item.name)} style={{paddingLeft:0}} />
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

    let sideMenuList = null;
    if(window.gpmsain === Constants.SUPER_RULECODE) {
      sideMenuList = menuList(menuItemsSuper.items, 0);
    } else if(window.gpmsain === Constants.ADMIN_RULECODE) {
      //sideMenuList = menuList(menuItemsAdmin.items, 0);
      let menus = fromJS(menuItemsAdmin);

      if(window.usePortable === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuPortable'));
        menus = menus.deleteIn(['items', index]);
      }

      sideMenuList = menuList(menus.get('items').toJS(), 0);
    } else if(window.gpmsain === Constants.PART_RULECODE) {
      let menus = fromJS(menuItemsPart);
      if(window.roleClientAdmin === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuClient'));
        menus = menus.deleteIn(['items', index]);
      }
      if(window.roleUserAdmin === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuUser'));
        menus = menus.deleteIn(['items', index]);
      }
      if(window.roleClientAdmin === 0 && window.roleUserAdmin === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuUseRule'));
        menus = menus.deleteIn(['items', index]);
      }

      if(window.roleDesktopAdmin === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuDesktop'));
        menus = menus.deleteIn(['items', index]);
      }
      if(window.roleNoticeAdmin === 0) {
        const index = menus.get('items').findIndex((n) => (n.get('name') === 'menuNotice'));
        menus = menus.deleteIn(['items', index]);
      }
      if (window.rolePortableAdmin === 0) {
        let index = menus.get('items').findIndex((n) => (n.get('name') === 'menuPortable'));
        menus = menus.deleteIn(['items', index]);
      } else if (window.rolePortableAdmin === 1) {
        let index = menus.get('items').findIndex((n) => (n.get('name') === 'menuJob'));
        menus = menus.deleteIn(['items', index]);
      }

      sideMenuList = menuList(menus.get('items').toJS(), 0);
    } else if(window.gpmsain === Constants.USER_RULECODE) {
      let menus = fromJS(menuItemsUser);

      sideMenuList = menuList(menus.get('items').toJS(), 0);
    }

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
          {sideMenuList}
          </List>
        </div>
        <AppBar position="static" style={{backgroundColor:"gray"}}>
          <Toolbar style={{minHeight:54}}>
            <Typography variant="overline" gutterBottom style={{width:'100%',textAlign:'center'}} >
              {/** SIDE FOOTER */}            
            </Typography>
          </Toolbar>
        </AppBar>
      </Drawer>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(GRSideMenu));
