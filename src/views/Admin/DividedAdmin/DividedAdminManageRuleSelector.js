import React, { Component } from "react";
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Constants from "components/GRComponents/GRConstants";

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import GRItemIcon from '@material-ui/icons/Adjust';

import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';
import Checkbox from '@material-ui/core/Checkbox';


import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class DividedAdminManageRuleSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
        selectedTab: 0,
        selectedValue: 'a',
        checked: ['client_add', 'client_delete', 'client_move', 'client_rule',
        'userAdd', 'userDelete', 'userMove', 'userRule',
        'ruleEdit', 'ruleUser', 'ruleClient', 'rule_value_04',
        'desktopEdit', 'desktopUser', 'desktopClient', 'desktop_value_04',
        'noticeEdit', 'noticeUser', 'noticeClient', 'notice_value_04'],
        checkClientRule: true,
    };
  }

  // edit
  handleClickEdit = (viewItem, compId) => {

  };

  handleChangeTabs = (event, value) => {
    this.setState({
        selectedTab: value
    });
  }

  handleChange = event => {
    // this.setState({ selectedValue: event.target.value });
  };

  handleToggle = name => event => {
    const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? 1 : 0) : event.target.value;
    this.props.AdminUserActions.setEditingItemValue({
        name: name,
        value: value
    });
  }

  render() {
    const { classes, compId, editingItem } = this.props;
    const { selectedTab } = this.state;

    const {selectedAdminId, selectedAdminName} = this.props;

    return (
      <div style={{marginTop: 10}} >
      { (selectedAdminId !== '') &&
        <React.Fragment>
        <Card>
          <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={"관리자 권한"}></CardHeader>
          {(editingItem.get('adminTp') === Constants.SUPER_TYPECODE || editingItem.get('adminTp') === Constants.ADMIN_TYPECODE) &&
          <CardContent style={{padding:0}}>
            <Typography variant="body1" style={{textAlign:'center',padding:30}} >전체관리자와 중간관리자는 세부설정이 필요 없습니다.</Typography>
          </CardContent>
          }
          {(editingItem.get('adminTp') === Constants.PART_TYPECODE) &&
          <CardContent style={{padding:0}}>

          <Grid container spacing={0} style={{padding:'10px 20px 10px 20px'}}>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >단말관리 권한
                <Checkbox checked={(editingItem) ? editingItem.get('isClientAdmin') == 1 : false}
                  onChange={this.handleToggle('isClientAdmin')} value="isClientAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >사용자관리 권한
                <Checkbox checked={(editingItem) ? editingItem.get('isUserAdmin') == 1 : false}
                  onChange={this.handleToggle('isUserAdmin')} value="isUserAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >데스크톱환경관리 권한
                <Checkbox checked={(editingItem) ? editingItem.get('isDesktopAdmin') == 1 : false}
                  onChange={this.handleToggle('isDesktopAdmin')} value="isDesktopAdmin"
                />
              </Typography>
            </Grid>
            <Grid item xs={3} className={classes.specCategory} style={{padding:0}}>
              <Typography variant="body1" style={{fontWeight:'bold'}} >공지관리
                <Checkbox checked={(editingItem) ? editingItem.get('isNoticeAdmin') == 1 : false}
                  onChange={this.handleToggle('isNoticeAdmin')} value="isNoticeAdmin"
                />
              </Typography>
            </Grid>
          </Grid>
  
          </CardContent>
          }
          </Card>

        </React.Fragment>
        }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageRuleSelector)));

