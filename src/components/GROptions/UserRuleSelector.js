
import React, {Component} from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

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


class UserRuleSelector extends Component {
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
            this.props.DesktopConfActions.changeCompVariable({
                compId:compId, name:'selectedOptionItemId', targetType:targetType, value: ''
            });
        } else {
            // reset selectedOptionItemId from beforeSelectedItemId.
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
                        <Tab label={t("lbBrowserRule")} value={0} />
                        <Tab label={t("lbMediaRule")} value={1} />
                        <Tab label={t("lbSecuRule")} value={2} />
                        <Tab label={t("lbSWRule")} value={3} />
                        <Tab label={t("lbDesktopConf")} value={4} />
                    </Tabs>
                </AppBar>
                <Paper elevation={0} style={{ maxHeight: 460, overflow: 'auto' }} >
                {selectedTab === 0 && <BrowserRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 1 && <MediaRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 2 && <SecurityRuleSelector compId={compId} targetType={targetType} />}
                {selectedTab === 3 && <SoftwareFilterSelector compId={compId} targetType={targetType} />}
                {selectedTab === 4 && <DesktopConfSelector compId={compId} targetType={targetType} />}
                </Paper>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule,
    SoftwareFilterProps: state.SoftwareFilterModule,
    DesktopConfProps: state.DesktopConfModule
});
  
const mapDispatchToProps = (dispatch) => ({
    BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
    MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
    SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
    SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
    DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)  
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserRuleSelector)));

