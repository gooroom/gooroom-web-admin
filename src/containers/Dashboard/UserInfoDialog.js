import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DashboardActions from 'modules/DashboardModule';

import GRConfirm from 'components/GRComponents/GRConfirm';

import ClientConfSettingSpec from 'views/Rules/ClientConfig/ClientConfSettingSpec';
import ClientHostNameSpec from 'views/Rules/HostName/ClientHostNameSpec';
import ClientUpdateServerSpec from 'views/Rules/UpdateServer/ClientUpdateServerSpec';

import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
import CtrlCenterItemSpec from 'views/Rules/UserConfig/CtrlCenterItemSpec';
import PolicyKitRuleSpec from 'views/Rules/UserConfig/PolicyKitRuleSpec';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserInfoDialog extends Component {

    render() {
        const { classes } = this.props;
        const { DashboardProps } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(DashboardProps.get('userInfoDialog')) &&
                <Dialog open={DashboardProps.get('userInfoDialog')} fullWidth={true} maxWidth="lg">
                    <DialogTitle>
                    <Grid container spacing={16}>
                        <Grid item xs={6} md={6}>{t("dtViewTotalRule")}</Grid>
                        <Grid item xs={6} md={6} style={{textAlign:'right',fontSize:'12px'}}>
                        {(DashboardProps.getIn(['selectedUserInfo', 'userId']) != '') &&
                        <div>{t("lbUserId")}: <font style={{fontWeight:'bold',fontSize:'15px'}}>{DashboardProps.getIn(['selectedUserInfo', 'userId'])}</font><br/></div>
                        }
                        {t("lbClientId")}: <font style={{fontWeight:'bold',fontSize:'15px'}}>{DashboardProps.getIn(['selectedUserInfo', 'clientId'])}</font>
                        </Grid>
                    </Grid>
                    {(DashboardProps.getIn(['selectedUserInfo', 'userId']) === undefined || DashboardProps.getIn(['selectedUserInfo', 'userId']) === '') &&
                    <Typography variant="overline" gutterBottom style={{marginTop:2,marginBottom:0,color:'#ca1717'}}>{t("msgShowOnlyClientGroupRule")}</Typography>
                    }
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={6}>
                                <ClientHostNameSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'hostNameConfMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <ClientUpdateServerSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'updateServerConfMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <ClientConfSettingSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'clientConfMap'])}
                                />
                            </Grid>

                            <Grid item xs={12} md={6} >
                                <BrowserRuleSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'browserRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <MediaRuleSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'mediaRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} >
                                <SecurityRuleSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'securityRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <SoftwareFilterSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'filteredSwRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <CtrlCenterItemSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'ctrlCenterItemRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <PolicyKitRuleSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'policyKitRuleMap'])}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <DesktopConfSpec specType="inform" targetType="" simpleTitle={true} hasAction={false}
                                    selectedItem={DashboardProps.getIn(['ruleData', 'desktopConfMap'])}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    DashboardProps: state.DashboardModule
});

const mapDispatchToProps = (dispatch) => ({
    DashboardActions: bindActionCreators(DashboardActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserInfoDialog)));
