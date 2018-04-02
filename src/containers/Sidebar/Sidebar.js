import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import classNames from 'classnames';
import nav from './_nav';
import SidebarMinimizer from "./SidebarMinimizer";
import Badge from 'material-ui/Badge';

import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from "material-ui/transitions/Collapse";
import InboxIcon from "material-ui-icons/MoveToInbox";
import DraftsIcon from "material-ui-icons/Drafts";
import ComputerIcon from "material-ui-icons/Computer";
import SendIcon from "material-ui-icons/Send";
import ExpandLess from "material-ui-icons/ExpandLess";
import ExpandMore from "material-ui-icons/ExpandMore";
import StarBorder from "material-ui-icons/StarBorder";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  grSideMenu: {
      paddingLeft: '15px',
      paddingRight: '5px',
  },
  grSideHeder: {
    height: '45px',
    textAlign: 'center'
  },
  grSideMenuItem: {
    paddingLeft: '0px',
    paddingRight: '0px',
  }
});

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {

    //console.log(e.target.parentElement);
    this.setState({ open: !this.state.open });
  }

  render() {
    const { classes } = this.props;

    // badge addon to NavItem
    const badge = (badge) => {
        if (badge) {
          const classes = classNames( badge.class );
          return (<Badge className={ classes } color={ badge.variant } badgeContent={badge.text} children={false}></Badge>)
        }
      };

    // simple wrapper for nav-title item
    const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

    // nav item with nav link
    const navItem = (item, key) => {
        //console.log(item);

        const classes = {
          item: classNames( item.class) ,
          link: classNames( 'nav-link', item.variant ? `nav-link-${item.variant}` : ''),
          icon: classNames( item.icon )
        };
        return (
          navLink(item, key, classes)
        )
      };

    // nav link
    const navLink = (item, key, classes) => {
        const url = item.url ? item.url : '';

        return (
          <li key={key} className={classes.item}>
            { isExternal(url) ?
              <RsNavLink href={url} className={classes.link} active>
                <i className={classes.icon}></i>{item.name}{badge(item.badge)}
              </RsNavLink>
              :
              <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
                <i className={classes.icon}></i>{item.name}{badge(item.badge)}
              </NavLink>
            }
          </li>
        )
      };

    // nav list section title
    const title =  (title, key) => {
        const classes = classNames( 'nav-title', title.class);
        return (<li key={key} className={ classes }>{wrapper(title)} </li>);
      };

    // nav type
    const navType = (item, idx) =>
      item.title ? title(item, idx) : 
         item.label ? navLabel(item, idx) : navItem(item, idx);
    //   item.divider ? divider(item, idx) :
    //   item.label ? navLabel(item, idx) :
    //   item.children ? navDropdown(item, idx)
    //                 : navItem(item, idx) ;
    
    // nav list
    const navList = (items) => {
        return items.map( (item, index) => navType(item, index) );
    };

    const isExternal = (url) => {
        const link = url ? url.substring(0, 4) : '';
        return link === 'http';
      };
  

    return (
        <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            {navList(nav.items)}
          </ul>
        </nav>
        <SidebarMinimizer/>
      </div>
    );
  }
}

// Sidebar.propTypes = {
//     classes: PropTypes.object.isRequired
//   };
// export default withStyles(styles)(Sidebar);

export default Sidebar;
  