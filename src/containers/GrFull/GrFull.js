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

import GrHeader from "containers/GrHeader/";
import GrFooter from "containers/GrFooter/";
import GrSideMenu from "containers/GrSideMenu";
import GrBreadcrumb from "containers/GrBreadcrumb/";

import AdminInform from "views/Admin/AdminInform";

import GrRouters from "containers/GrContent/";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';


const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      sizeSmall: {
        padding: 0,
        minWidth: 48,
        minHeight: 24
      },
    },
    MuiIconButton: {
      root: {
        paddingTop: 0,
        paddingBottom: 0
      }
    },
    MuiTableCell: {
      root: {
        padding: '0 6 0 0'
      }
    },
    MuiTableRow: {
      root: {
        height: 32
      }
    },
    MuiSvgIcon: {
      root: {
        fontSize: 16
      }
    }
  }
});

class GrFull extends Component {

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

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.fullRoot} >
          <GrHeader toggleDrawer={this.toggleDrawer} onAdminClick={this.handleClickAdmin} onSystemClick={this.handleClickSystem} />
          <div className={classes.appBody}>
            <GrSideMenu sideOpen={this.state.sideOpen} />
            <main className={classNames({[classes.fullMain]: !this.state.isMainWide}, {[classes.fullWideMain]: this.state.isMainWide})}>
              <div>
                <GrBreadcrumb />
                <GrRouters />
              </div>
              <GrFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(GrFull));


