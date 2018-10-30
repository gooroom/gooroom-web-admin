
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

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';


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
                        <Tab label="단말정책" value={0}/>
                        <Tab label="Hosts정보" value={1} />
                        <Tab label="업데이트서버정보" value={2} />
                        <Tab label="브라우져정책" value={3} />
                        <Tab label="매체제어정책" value={4} />
                        <Tab label="단말보안정책" value={5} />
                    </Tabs>
                </AppBar>
                <Paper elevation={0} style={{ maxHeight: 460, overflow: 'auto' }} >
                {selectedTab === 0 && <ClientConfSettingSelector compId={compId} initId={module ? module.clientConfigId : '-'} targetType={targetType} />}
                {selectedTab === 1 && <ClientHostNameSelector compId={compId} initId={module ? module.hostNameConfigId : '-'} targetType={targetType} />}
                {selectedTab === 2 && <ClientUpdateServerSelector compId={compId} initId={module ? module.updateServerConfigId : '-'} targetType={targetType} />}
                {selectedTab === 3 && <BrowserRuleSelector compId={compId} initId={module ? module.browserRuleId : '-'} targetType={targetType} />}
                {selectedTab === 4 && <MediaRuleSelector compId={compId} initId={module ? module.mediaRuleId : '-'} targetType={targetType} />}
                {selectedTab === 5 && <SecurityRuleSelector compId={compId} initId={module ? module.securityRuleId : '-'} targetType={targetType} />}
                </Paper>
            
            </React.Fragment>
        );
    }
}

export default withStyles(GRCommonStyle)(ClientRuleSelector);


