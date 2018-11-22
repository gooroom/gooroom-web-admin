import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import GRHeader from "containers/GRHeader/";
import GRFooter from "containers/GRFooter/";
import GRSideMenu from "containers/GRSideMenu";
import GRBreadcrumb from "containers/GRBreadcrumb/";

import AdminInform from "views/Admin/AdminInform";

import GRRouters from "containers/GRContent/";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import GRTheme from 'ui/theme/GRTheme';

class GRFull extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sideOpen: true,
      isMainWide: false,
      rightDrawer: false,
      popMenu: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen,
      isMainWide: !this.state.isMainWide
    });
  }

  toggleRightDrawer = (side, open) => () => {
    console.log('side : ', side);
    console.log('open : ', open);
    this.setState({
      [side]: open
    });
  };

  handleClickAdmin = () => {
    //console.log("handleClickAdmin...........");
    this.setState({
      rightDrawer: true,
    });
  }

  handleClickSystem = () => {
    //console.log("handleClickSystem...........");
    this.setState(state => ({ popMenu: !state.popMenu }));
  }

  handlePopoverClose = () => {
    const { GlobalActions } = this.props;
    GlobalActions.closeElementMsg();
  }

  render() {
    const { classes } = this.props;
    const { GlobalProps } = this.props;
    const anchorEl = GlobalProps.get('popoverElement');
    
    console.log('GRFull...........................', this.props);

    return (
      <MuiThemeProvider theme={createMuiTheme(GRTheme)}>
        <CssBaseline />
        <div className={classes.fullRoot} >
          <GRHeader toggleDrawer={this.toggleDrawer} onAdminClick={this.handleClickAdmin} onSystemClick={this.handleClickSystem} />
          <div className={classes.appBody}>
            <GRSideMenu sideOpen={this.state.sideOpen} />
            <main className={classNames({[classes.fullMain]: !this.state.isMainWide}, {[classes.fullWideMain]: this.state.isMainWide})}>
              <div>
                <GRBreadcrumb />
                <GRRouters />
              </div>
              <GRFooter />
            </main>
          </div>
        </div>

        <Drawer anchor="right" open={this.state.rightDrawer} onClose={this.toggleRightDrawer('rightDrawer', false)}>
          <AdminInform 
            role="button"
            onClick={this.toggleRightDrawer('rightDrawer', false)}
            onKeyDown={this.toggleRightDrawer('rightDrawer', false)}
          />
        </Drawer>

        <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={this.handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Typography className={classes.popoverMsg}>
            {GlobalProps.get('popoverText')}
          </Typography>
        </Popover>          
      </MuiThemeProvider>

    );
  }
}

const mapStateToProps = (state) => ({
  GlobalProps: state.GlobalModule
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRFull));


