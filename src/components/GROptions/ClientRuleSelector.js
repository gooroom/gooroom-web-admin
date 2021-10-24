
import React, {Component} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as CtrlCenterItemActions from 'modules/CtrlCenterItemModule';
import * as PolicyKitRuleActions from 'modules/PolicyKitRuleModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

import ClientConfSettingSelector from 'views/Rules/ClientConfig/ClientConfSettingSelector'
import ClientHostNameSelector from 'views/Rules/HostName/ClientHostNameSelector'
import ClientUpdateServerSelector from 'views/Rules/UpdateServer/ClientUpdateServerSelector'

import BrowserRuleSelector from 'views/Rules/UserConfig/BrowserRuleSelector';
import MediaRuleSelector from 'views/Rules/UserConfig/MediaRuleSelector';
import SecurityRuleSelector from 'views/Rules/UserConfig/SecurityRuleSelector';
import SoftwareFilterSelector from 'views/Rules/UserConfig/SoftwareFilterSelector';
import CtrlCenterItemSelector from 'views/Rules/UserConfig/CtrlCenterItemSelector';
import PolicyKitRuleSelector from 'views/Rules/UserConfig/PolicyKitRuleSelector';

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

    componentDidMount() {
        const { compId, module, targetType } = this.props;

        if(module == 'new') {
            // delete selectedOptionItemId for new editing.
            this.props.ClientConfSettingActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.ClientHostNameActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.ClientUpdateServerActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.MediaRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.BrowserRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.SecurityRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.SoftwareFilterActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.CtrlCenterItemActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.PolicyKitRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
            this.props.DesktopConfActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
        } else {
            // reset selectedOptionItemId from beforeSelectedItemId.
            this.props.ClientConfSettingActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.ClientConfSettingProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.ClientHostNameActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.ClientHostNameProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.ClientUpdateServerActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.ClientUpdateServerProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.MediaRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.MediaRuleProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.BrowserRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.BrowserRuleProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.SecurityRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.SecurityRuleProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.SoftwareFilterActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.SoftwareFilterProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.CtrlCenterItemActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.CtrlCenterItemProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.PolicyKitRuleActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.PolicyKitRuleProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
            this.props.DesktopConfActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, 
                value: this.props.DesktopConfProps.getIn(['viewItems', compId, targetType, 'beforeSelectedItemId'])
            });
        }
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
                        variant="scrollable"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChangeTabs}
                    >
                        <Tab label={t("lbClientSetup")} value={0}/>
                        <Tab label={t("lbHosts")} value={1} />
                        <Tab label={t("lbUpdateServer")} value={2} />
                        <Tab label={t("lbBrowserRule")} value={3} />
                        <Tab label={t("lbMediaRule")} value={4} />
                        <Tab label={t("lbSecuRule")} value={5} />
                        <Tab label={t("lbSWRule")} value={6} />
                        <Tab label={t("lbCTIRule")} value={7} />
                        <Tab label={t("lbPolicyKitRule")} value={8} />
                        <Tab label={t("lbDesktopConf")} value={9} />
                    </Tabs>
                </AppBar>
                <Paper elevation={0} style={{ maxHeight: 460, overflow: 'auto' }} >
                {selectedTab === 0 && <ClientConfSettingSelector compId={compId} targetType={targetType} />}
                {selectedTab === 1 && <ClientHostNameSelector compId={compId} targetType={targetType} />}
                {selectedTab === 2 && <ClientUpdateServerSelector compId={compId} targetType={targetType} />}
                {selectedTab === 3 && <BrowserRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 4 && <MediaRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 5 && <SecurityRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 6 && <SoftwareFilterSelector compId={compId} targetType={targetType} />}
                {selectedTab === 7 && <CtrlCenterItemSelector compId={compId} targetType={targetType} />}
                {selectedTab === 8 && <PolicyKitRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 9 && <DesktopConfSelector compId={compId} targetType={targetType} />}
                </Paper>
            
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientConfSettingProps: state.ClientConfSettingModule,
    ClientHostNameProps: state.ClientHostNameModule,
    ClientUpdateServerProps: state.ClientUpdateServerModule,
    
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    CtrlCenterItemProps: state.CtrlCenterItemModule,
    PolicyKitRuleProps: state.PolicyKitRuleModule,

    DesktopConfProps: state.DesktopConfModule
});
  
const mapDispatchToProps = (dispatch) => ({
    ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
  
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
    SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
    CtrlCenterItemActions: bindActionCreators(CtrlCenterItemActions, dispatch),
    PolicyKitRuleActions: bindActionCreators(PolicyKitRuleActions, dispatch),

    DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)  
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientRuleSelector)));



