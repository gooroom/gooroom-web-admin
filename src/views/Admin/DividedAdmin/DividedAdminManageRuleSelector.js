import React, { Component } from "react";
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
          <CardContent style={{padding:0}}>
            <AppBar elevation={0} position="static" color="default">
              <Tabs style={{minHeight:24}}
                value={selectedTab}
                onChange={this.handleChangeTabs}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label='단말관리' style={{minHeight:24}} />
                <Tab label='사용자관리' style={{minHeight:24}} />
                <Tab label='정책관리' style={{minHeight:24}} />
                <Tab label='데스크톱환경관리' style={{minHeight:24}} />
                <Tab label='공지관리' style={{minHeight:24}} />
              </Tabs>
            </AppBar>
            {selectedTab === 0 && <Card >
              <CardContent>
                <Typography variant="body1" style={{fontWeight:'bold',textAlign:'center'}} >단말관리 권한정보
                  <Checkbox checked={(editingItem) ? editingItem.get('isClientAdmin') == 1 : false}
                    onChange={this.handleToggle('isClientAdmin')} value="isClientAdmin"
                  />
                </Typography>
                <Grid container spacing={0} style={{border:'1px solid lightGray'}}>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말이동, 그룹에서 제거</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('clientMove')}
                            checked={(editingItem) ? editingItem.get('clientMove') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말 폐기</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('clientDelete')}
                            checked={(editingItem) ? editingItem.get('clientDelete') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      {/* 
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말 신규 등록</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('clientAdd')}
                            checked={(editingItem) ? editingItem.get('clientAdd') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      */}
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말정책 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('clientRule')}
                            checked={(editingItem) ? editingItem.get('clientRule') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>}
            {selectedTab === 1 && <Card >
              <CardContent>
                <Typography variant="body1" style={{fontWeight:'bold',textAlign:'center'}} >사용자관리 권한정보
                  <Checkbox checked={(editingItem) ? editingItem.get('isUserAdmin') == 1 : false}
                    onChange={this.handleToggle('isUserAdmin')} value="isUserAdmin"
                  />
                </Typography>
                <Grid container spacing={0} style={{border:'1px solid lightGray'}}>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자 등록</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('userAdd')}
                            checked={(editingItem) ? editingItem.get('userAdd') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자이동, 조직에서 제거</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('userMove')}
                            checked={(editingItem) ? editingItem.get('userMove') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자 제거</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('userDelete')}
                            checked={(editingItem) ? editingItem.get('userDelete') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자대상 사용정책 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('userRule')}
                            checked={(editingItem) ? editingItem.get('userRule') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>}
            {selectedTab === 2 && <Card >
              <CardContent>
                <Typography variant="body1" style={{fontWeight:'bold',textAlign:'center'}} >정책관리 권한정보
                  <Checkbox checked={(editingItem) ? editingItem.get('isRuleAdmin') == 1 : false}
                    onChange={this.handleToggle('isRuleAdmin')} value="isRuleAdmin"
                  />
                </Typography>
                <Grid container spacing={0} style={{border:'1px solid lightGray'}}>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말 사용정책 등록,수정,삭제</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('ruleEdit')}
                            checked={(editingItem) ? editingItem.get('ruleEdit') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말대상 정책 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('ruleClient')}
                            checked={(editingItem) ? editingItem.get('ruleClient') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자대상 정책 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('ruleUser')}
                            checked={(editingItem) ? editingItem.get('ruleUser') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>}
            {selectedTab === 3 && <Card >
              <CardContent>
                <Typography variant="body1" style={{fontWeight:'bold',textAlign:'center'}} >데스크톱환경관리 권한정보
                  <Checkbox checked={(editingItem) ? editingItem.get('isDesktopAdmin') == 1 : false}
                    onChange={this.handleToggle('isDesktopAdmin')} value="isDesktopAdmin"
                  />
                </Typography>
                <Grid container spacing={0} style={{border:'1px solid lightGray'}}>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">데스크톱환경 등록,수정,삭제</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('desktopEdit')}
                            checked={(editingItem) ? editingItem.get('desktopEdit') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말대상 데스크톱환경 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('desktopClient')}
                            checked={(editingItem) ? editingItem.get('desktopClient') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자대상 데스크톱환경 적용</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('desktopUser')}
                            checked={(editingItem) ? editingItem.get('desktopUser') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>}
            {selectedTab === 4 && <Card >
              <CardContent>
                <Typography variant="body1" style={{fontWeight:'bold',textAlign:'center'}} >공지관리 권한정보
                  <Checkbox checked={(editingItem) ? editingItem.get('isNoticeAdmin') == 1 : false}
                    onChange={this.handleToggle('isNoticeAdmin')} value="isNoticeAdmin"
                  />
                </Typography>
                <Grid container spacing={0} style={{border:'1px solid lightGray'}}>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">공지사항 등록,수정,삭제</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('noticeEdit')}
                            checked={(editingItem) ? editingItem.get('noticeEdit') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">단말대상 공지 게시</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('noticeClient')}
                            checked={(editingItem) ? editingItem.get('noticeClient') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={6}>
                    <List disablePadding={true} >
                      <ListItem >
                        <ListItemIcon style={{marginRight:0}}><GRItemIcon fontSize='small'/></ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle2">사용자대상 공지 게시</Typography>} />
                        <ListItemSecondaryAction>
                          <Switch color='primary' onChange={this.handleToggle('noticeUser')}
                            checked={(editingItem) ? editingItem.get('noticeUser') == 1 : false}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>}
          </CardContent>
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

