import React, { Component } from "react";
import axios, { post }  from "axios";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as AdminActions from 'modules/AdminModule';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';

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

    let that = this;
    axios.interceptors.response.use(function (response) {
        return response;
      }, function (error) {
        if(error.response.status === 944) { window.location.reload(); }
        return Promise.reject(error);
    });
  }

  componentDidMount() {
    const { AdminActions } = this.props;
    AdminActions.getAdminInfo();
  }  

  toggleDrawer() {
    this.setState({
      sideOpen: !this.state.sideOpen,
      isMainWide: !this.state.isMainWide
    });
  }

  toggleRightDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  handleClickAdmin = () => {
    this.setState({
      rightDrawer: true,
    });
  }

  handleClickSystem = () => {
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
      <MuiThemeProvider theme={createMuiTheme(GRTheme)}>
        <CssBaseline />
        <div className={classes.fullRoot} >
          <GRHeader toggleDrawer={this.toggleDrawer} onAdminClick={this.handleClickAdmin} onSystemClick={this.handleClickSystem} />
          <div className={classes.appBody}>
            <GRSideMenu sideOpen={this.state.sideOpen} />
            <div className={classNames({[classes.fullMain]: !this.state.isMainWide}, {[classes.fullWideMain]: this.state.isMainWide})}>
              <div style={{overflowX:'auto'}}>
                <GRBreadcrumb pathname={(this.props.location.pathname) ? this.props.location.pathname : ''}/>
                <GRRouters />
              </div>
              <GRFooter />
            </div>
          </div>
        </div>

        <Drawer anchor="right" open={this.state.rightDrawer} onClose={this.toggleRightDrawer('rightDrawer', false)}>
          <AdminInform 
            role="button"
            onClick={this.toggleRightDrawer('rightDrawer', false)}
            onKeyDown={this.toggleRightDrawer('rightDrawer', false)}
            {...this.props}
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
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  AdminActions: bindActionCreators(AdminActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRFull));


