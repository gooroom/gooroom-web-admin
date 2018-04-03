import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import { grLayout } from "../../templates/default/GrLayout";
import { grColors } from "../../templates/default/GrColors";

import classNames from "classnames";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';

import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import StarBorder from 'material-ui-icons/StarBorder';
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";

import { otherMailFolderListItems } from "./tileData";
import { GrMenuItems } from "./menuData";

import InboxIcon from "material-ui-icons/MoveToInbox";

const styles = {
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
  menuItem: {
    color: grColors.sideBarText,
  }
};

class GrSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: "left",
      open: false
    };
  }

  handleClick = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { classes } = this.props;

    console.log(GrMenuItems);

    return (
      <Drawer
        classes={{ docked: classes.docked, paper: classes.paper }}
        variant="persistent"
        anchor={this.state.anchor}
        open={this.props.sideOpen}
      >
        <div>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        
        <List>
          <ListItem button >
            <ListItemIcon>
              <InboxIcon className={classes.menuItem} />
            </ListItemIcon>
            <ListItemText>
              <Typography className={classes.menuItem}>등록관리</Typography>
            </ListItemText>
          </ListItem>
          <List>
            <ListItem button onClick={this.handleClick}>
              <ListItemIcon>
                <InboxIcon className={classes.menuItem} />
              </ListItemIcon>
              <ListItemText inset >
                <Typography className={classes.menuItem}>등록관리</Typography>
              </ListItemText>
              {this.state.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="Starred" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </List>
        <Divider />
        {GrMenuItems}
      </Drawer>
    );
  }
}

// GrSideMenu.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired
// };
// export default withStyles(styles, { withTheme: true })(GrSideMenu);

GrSideMenu.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(GrSideMenu);

//export default GrSideMenu;
