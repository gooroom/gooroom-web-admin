import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from 'react-router-dom';

import GRAlarmInform from 'views/Admin/GRAlarmInform';

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from '@material-ui/core/Button';

import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { translate, Trans } from "react-i18next";

class GRHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popMenu: false
    };
  }

  handleChange(event, index, value) {
    this.setState({ value });
  }

  handleClickSystem = () => {
    this.setState(state => ({ popMenu: !state.popMenu }));
  }

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ popMenu: false });
  };

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    return (
      <AppBar className={classes.headerRoot}>
        <Toolbar className={classes.headerToolbar}>
            <Typography type="title" className={classes.headerBrandLogo}>
              GPMS v1.2.0329
            </Typography>
            <IconButton onClick={this.props.toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <div style={{flex: "1 1 auto"}}>
              <Button onClick={() => changeLanguage("kr")}>kr</Button>
              <Button onClick={() => changeLanguage("en")}>en</Button>
            </div>
            <GRAlarmInform />
            <Button onClick={this.props.onAdminClick}>
              <AccountCircle />{t("adminMenu")}
            </Button>
            <Button 
              buttonRef={node => {
                this.anchorEl = node;
              }}
              onClick={this.handleClickSystem}
            >
              <SettingsApplications />Server
            </Button>
            <Popper open={this.state.popMenu} anchorEl={this.anchorEl} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        <MenuItem component={Link} to={'/system/siteconfig/GRM9901/menuSiteConfig'}>{t("menuSiteConfig")}</MenuItem>
                        <MenuItem component={Link} to={'/system/adminusermng/GRM9902/menuAdminUserMng'}>{t("menuAdminUserMng")}</MenuItem>
                        <MenuItem component={Link} to={'/system/deptuserreg/GRM9903/menuDeptAndUser'}>{t("menuDeptAndUser")}</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
        </Toolbar>
      </AppBar>
    );
  }
}

export default translate("translations")(withStyles(GRCommonStyle)(GRHeader));
