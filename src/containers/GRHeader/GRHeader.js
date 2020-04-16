import React, { Component } from "react";
import * as Constants from "components/GRComponents/GRConstants";

import { Link } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminActions from 'modules/AdminModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

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

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { translate, Trans } from "react-i18next";
import { VERSION } from "../../constants";

class GRHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popMenu: false
    };
  }

  componentDidMount() {
    clearInterval(this.violatedTimer)
    this.violatedTimer = null;
    this.violatedTimer = setInterval(()=> this.getViolatedData(), 20000);
  }
  
  componentWillUnmount() {
    clearInterval(this.violatedTimer)
    this.violatedTimer = null; // here...
  }

  getViolatedData() {
    const { AdminActions } = this.props;
    AdminActions.readViolatedClientCount();
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

  handleCloseInfo = (e) => {
    const { AdminActions } = this.props;
    AdminActions.clearLoginTrialInfo();
  }

  render() {
    const { classes, AdminProps } = this.props;
    const { t, i18n } = this.props;

    const changeLanguage = lng => {
      i18n.changeLanguage(lng);
    };

    const dupDialogOpen = (AdminProps.get('dupLoginIp') !== undefined && AdminProps.get('dupLoginIp') !== '') ? true : false;

    return (
      <AppBar className={classes.headerRoot}>
        <Toolbar className={classes.headerToolbar}>
          <Typography type="title" className={classes.headerBrandLogo}>
            GPMS {VERSION}
          </Typography>
          <IconButton onClick={this.props.toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <div style={{ flex: "1 1 auto" }}>
            <Button onClick={() => changeLanguage("kr")}>kr</Button>
            <Button onClick={() => changeLanguage("en")}>en</Button>
          </div>
          {(window.gpmsain !== Constants.SUPER_RULECODE && window.gpmsain !== Constants.PART_RULECODE) &&
            <GRAlarmInform />
          }
          <Button onClick={this.props.onAdminClick}>
            <AccountCircle />{t("adminMenu")}
          </Button>
          {(window.gpmsain !== Constants.PART_RULECODE) &&
            <Button
              buttonRef={node => {
                this.anchorEl = node;
              }}
              onClick={this.handleClickSystem}
            >
              <SettingsApplications />{t("serverMenu")}
            </Button>
          }
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
                      {(window.gpmsain === Constants.SUPER_RULECODE) &&
                        <MenuList>
                          <MenuItem component={Link} to={'/system/adminusermng/GRM9902/menuAdminUserMng'}>{t("menuAdminUserMng")}</MenuItem>
                          <MenuItem component={Link} to={'/system/siteconfig/GRM9901/menuSiteConfig'}>{t("menuSiteConfig")}</MenuItem>
                          <MenuItem component={Link} to={'/system/deptuserreg/GRM9903/menuDeptAndUser'}>{t("menuDeptAndUser")}</MenuItem>
                        </MenuList>
                      }
                      {(window.gpmsain === Constants.ADMIN_RULECODE) &&
                        <MenuList>
                          <MenuItem component={Link} to={'/system/adminusermng/GRM9902/menuAdminUserMng'}>{t("menuAdminUserMng")}</MenuItem>
                        </MenuList>
                      }
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Toolbar>
        <Dialog aria-labelledby="customized-dialog-title" open={dupDialogOpen}>
          <DialogTitle id="customized-dialog-title">관리자 계정 접속 시도</DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              현재 사용하시는 관리자 계정으로 아래 위치에서 접속시도가 있었습니다.
          </Typography>
            <Typography variant='body1' gutterBottom>
            <div>IP : {AdminProps.get('dupLoginIp')}</div>
            <div>Date : {formatDateToSimple(AdminProps.get('dupLoginDate'), 'YYYY-MM-DD HH:mm:ss')}</div>
          </Typography>
            <Typography gutterBottom>
             "정보 확인" 버튼을 누르면 정보가 제거됩니다.
          </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleCloseInfo}>
              정보 확인
          </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminActions: bindActionCreators(AdminActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRHeader)));

