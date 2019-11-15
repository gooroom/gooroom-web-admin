

import React, { Component } from "react";
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import DeptAndUserMultiSelector from 'components/GROptions/DeptAndUserMultiSelector';
import GroupAndClientMultiSelector from 'components/GROptions/GroupAndClientMultiSelector';

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

class NoticePublishTargetSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    handleChangeTabs = (event, value) => {
        this.setState({ selectedTab: value });
    }

    handleSelectDept = (selectedItems) => {
        this.props.NoticePublishActions.setEditingItemValue({ name: 'deptInfoList', value: selectedItems });
    }

    handleSelectUser = (selectedItems) => {
        this.props.NoticePublishActions.setEditingItemValue({ name: 'userInfoList', value: selectedItems });
    }

    handleSelectGroup = (selectedItems) => {
        this.props.NoticePublishActions.setEditingItemValue({ name: 'grpInfoList', value: selectedItems });
    }

    handleSelectClient = (selectedItems) => {
        this.props.NoticePublishActions.setEditingItemValue({ name: 'clientInfoList', value: selectedItems });
    }

    render() {
        const { classes, compId, editingItem, t } = this.props;
        const { selectedTab } = this.state;

        const selectedDept = (editingItem && editingItem.get('deptInfoList')) ? editingItem.get('deptInfoList') : null;
        const selectedUser = (editingItem && editingItem.get('userInfoList')) ? editingItem.get('userInfoList') : null;

        const selectedGroup = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList') : null;
        const selectedClient = (editingItem && editingItem.get('clientInfoList')) ? editingItem.get('clientInfoList') : null;

        return (
            <div style={{marginTop: 10}} >
            {
            <React.Fragment>
                <AppBar elevation={0} position="static" color="default">
                    <Tabs style={{minHeight:24}}
                        value={selectedTab}
                        onChange={this.handleChangeTabs}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="scrollable"
                        scrollButtons="auto">
                        <Tab label={t('lbClientGroupAndClient')} style={{minHeight:24}} />
                        <Tab label={t('lbDepartmentAndUser')} style={{minHeight:24}} />
                    </Tabs>
                </AppBar>
                {selectedTab === 0 &&
                    <GroupAndClientMultiSelector compId={compId}
                        isCheckMasterOnly={false}
                        selectedGroup={selectedGroup} 
                        onSelectGroup={this.handleSelectGroup}
                        selectedClient={selectedClient} 
                        onSelectClient={this.handleSelectClient}/>
                }
                {selectedTab === 1 &&
                    <DeptAndUserMultiSelector compId={compId}
                        isCheckMasterOnly={false}
                        selectedDept={selectedDept} 
                        onSelectDept={this.handleSelectDept}
                        selectedUser={selectedUser} 
                        onSelectUser={this.handleSelectUser}/>
                }
            </React.Fragment>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    NoticePublishProps: state.NoticePublishModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishTargetSelector)));