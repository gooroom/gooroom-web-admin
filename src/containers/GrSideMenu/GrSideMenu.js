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
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import { otherMailFolderListItems } from "./tileData";

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
//    display: "block",
    // overflowY: "auto",
    // display: "flex",
    // flexDirection: "column",
    // height: "100vh",
    // flex: "1 0 auto",
    // //zIndex: theme.zIndex.drawer,
    // WebkitOverflowScrolling: "touch", // Add iOS momentum scrolling.
    // // temporary style
    // // position: 'fixed',

    // //top: 0,
    // // We disable the focus ring for mouse, touch and keyboard users.
    // // At some point, it would be better to keep it for keyboard users.
    // // :focus-ring CSS pseudo-class will help.
    "&:focus": {
      outline: "none"
    }
  },
  menuItem: {
    color: grColors.sideBarText,
  }
};

class GrSideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: "left"
    };
  }

  render() {
    const { classes } = this.props;

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
          <ListItem button >
            <ListItemIcon>
              <InboxIcon className={classes.menuItem} />
            </ListItemIcon>
            <ListItemText>
              <Typography className={classes.menuItem}>등록관리</Typography>
            </ListItemText>
          </ListItem>
        </List>
        </List>
        <Divider />
        <List>{otherMailFolderListItems}</List>
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
