import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import classNames from "classnames";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import List from "material-ui/List";
import { MenuItem } from "material-ui/Menu";
import Typography from "material-ui/Typography";
import TextField from "material-ui/TextField";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import { mailFolderListItems, otherMailFolderListItems } from "./tileData";

const drawerWidth = 240;
const styles = {
  root: {
      width: 240,
      marginTop: 55,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flex: '1 0 auto',
      //zIndex: theme.zIndex.drawer,
      WebkitOverflowScrolling: 'touch', // Add iOS momentum scrolling.
      // temporary style
      // position: 'fixed',

      //top: 0,
      // We disable the focus ring for mouse, touch and keyboard users.
      // At some point, it would be better to keep it for keyboard users.
      // :focus-ring CSS pseudo-class will help.
      '&:focus': {
        outline: 'none',
      },
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
        <div>
          <Drawer classes={{ paper: classes.root}}
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
            <List>{mailFolderListItems}</List>
            <Divider />
            <List>{otherMailFolderListItems}</List>
          </Drawer>
        </div>
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
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(GrSideMenu);

//export default GrSideMenu;

