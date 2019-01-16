
import React, {Component} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import ClientConfSettingSelector from 'views/Rules/ClientConfig/ClientConfSettingSelector'
import ClientHostNameSelector from 'views/Rules/HostName/ClientHostNameSelector'
import ClientUpdateServerSelector from 'views/Rules/UpdateServer/ClientUpdateServerSelector'

import BrowserRuleSelector from 'views/Rules/UserConfig/BrowserRuleSelector';
import MediaRuleSelector from 'views/Rules/UserConfig/MediaRuleSelector';
import SecurityRuleSelector from 'views/Rules/UserConfig/SecurityRuleSelector';
import SoftwareFilterSelector from 'views/Rules/UserConfig/SoftwareFilterSelector';

import DesktopConfSelector from 'views/Rules/DesktopConfig/DesktopConfSelector';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { translate, Trans } from "react-i18next";


class ClientRuleSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        };
    }

    handleChangeTabs = (event, value) => {
        this.setState({
            selectedTab: value
        });
    }

    render() {
        const { selectedTab } = this.state;
        const { compId, module, targetType } = this.props;
        const { t, i18n } = this.props;

        return (
            <React.Fragment>
                <AppBar elevation={0} position="static" color="default">
                    <Tabs value={selectedTab} 
                        scrollable    
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChangeTabs}
                    >
                        <Tab label={t("lbClientConf")} value={0}/>
                        <Tab label={t("lbHosts")} value={1} />
                        <Tab label={t("lbUpdateServer")} value={2} />
                        <Tab label={t("lbBrowserRule")} value={3} />
                        <Tab label={t("lbMediaRule")} value={4} />
                        <Tab label={t("lbSecuRule")} value={5} />
                        <Tab label={t("lbSWRule")} value={6} />
                        <Tab label={t("lbDesktopConf")} value={7} />
                    </Tabs>
                </AppBar>
                <Paper elevation={0} style={{ maxHeight: 460, overflow: 'auto' }} >
                {selectedTab === 0 && <ClientConfSettingSelector compId={compId} initId={module ? module.clientConfigId : '-'} targetType={targetType} />}
                {selectedTab === 1 && <ClientHostNameSelector compId={compId} initId={module ? module.hostNameConfigId : '-'} targetType={targetType} />}
                {selectedTab === 2 && <ClientUpdateServerSelector compId={compId} initId={module ? module.updateServerConfigId : '-'} targetType={targetType} />}
                {selectedTab === 3 && <BrowserRuleSelector compId={compId} initId={module ? module.browserRuleId : '-'} targetType={targetType} />}
                {selectedTab === 4 && <MediaRuleSelector compId={compId} initId={module ? module.mediaRuleId : '-'} targetType={targetType} />}
                {selectedTab === 5 && <SecurityRuleSelector compId={compId} initId={module ? module.securityRuleId : '-'} targetType={targetType} />}
                {selectedTab === 6 && <SoftwareFilterSelector compId={compId} initId={module ? module.filteredSoftwareRuleId : '-'} targetType={targetType} />}
                {selectedTab === 7 && <DesktopConfSelector compId={compId} initId={module ? module.desktopConfigId : '-'} targetType={targetType} />}
                </Paper>
            
            </React.Fragment>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(ClientRuleSelector));


