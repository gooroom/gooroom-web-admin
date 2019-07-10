import React, {Component} from 'react';
import { Redirect } from 'react-router';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DashboardActions from 'modules/DashboardModule';
import * as AdminActions from 'modules/AdminModule';
import * as SecurityLogActions from 'modules/SecurityLogModule';

import UserInfoDialog from './UserInfoDialog';
import GRPane from 'containers/GRContent/GRPane';

import ClientOnOff from './ClientOnOff';
import UserLogin from './UserLogin';
import PackageUpdate from './PackageUpdate';

import ViolatedStatus from './ViolatedStatus';

import ClientListForDashboard from 'views/Client/ClientListForDashboard';

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class Dashboard extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            currentCount: 0,
            isRunningTimer: false,
            linkType: '',
            redirect: false
        };
    }

    componentDidMount() {
        const { DashboardActions, DashboardProps } = this.props;
        DashboardActions.readClientStatusForDashboard();
        this.handleClickChangePeriod('day');
        this.dashboardTimer = setInterval(()=> this.refreshDashboard(), 1000);
    }

    componentWillUnmount() {
        this.setState({
            isRunningTimer: false
        });
        clearInterval(this.dashboardTimer)
        this.dashboardTimer = null; // here...
    }

    refreshDashboard() {
        if(this.props.AdminProps.get('pollingCycle') > 4) {
            if(this.state.currentCount < 1) {
                this.setState({
                    currentCount: this.props.AdminProps.get('pollingCycle'),
                    isRunningTimer: true
                });
                this.props.DashboardActions.readClientStatusForDashboard();
            } else {
                const newCount = this.state.currentCount - 1;
                this.setState({
                    currentCount: newCount,
                    isRunningTimer: true
                });
            }
        }
    }

    handleClickLink = (linkType) => {
        this.setState({
            linkType: linkType,
            redirect: true
        });
    };

    handleClickChangePeriod = (type) => {
        this.props.DashboardActions.readViolatedClientStatus({
            countType: type
        });
    }

    handleClickViolatedLink = (type, clientId) => {
        const { AdminActions, SecurityLogActions, SecurityLogProps } = this.props;
        if(SecurityLogProps.getIn(['viewItems', 'GRM0935'])) {
            SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, 'GRM0935', {logItem:type,keyword:clientId,page:0});
        }
        AdminActions.redirectPage({address:'/log/secretlog/GRM0935/menuSecurityLog?logItem=' + type + '&keyword=' + clientId});
    }

    handleClickPackageLink = (type, clientId) => {
        //const { AdminActions, SecurityLogActions, SecurityLogProps } = this.props;
        // if(SecurityLogProps.getIn(['viewItems', 'GRM0935'])) {
        //     SecurityLogActions.readSecurityLogListPaged(SecurityLogProps, 'GRM0935', {logItem:type,keyword:clientId,page:0});
        // }
        //AdminActions.redirectPage({address:'/package/packagemanage/GRM0201/menuPackageManage?logItem=' + type + '&keyword=' + clientId});
    }

    handleClickShowUserInfo = (loginId, clientId) => {
        this.props.DashboardActions.showUserInfo({
            userId: loginId,
            clientId: clientId
        });
    }
    handleClickCloseUserInfo = () => {
        this.props.DashboardActions.closeUserInfo();
    }

    render() {
        if (this.state.redirect) {
            if(this.state.linkType == 'package') {
                return <Redirect push to ='/package/packagemanage/GRM0201/menuPackageManage' />;
            } else if(this.state.linkType == 'client') {
                return <Redirect push to="/clients/clientmastermanage/GRM0101/menuClientManage" />;
            } else if(this.state.linkType == 'user') {
                return <Redirect push to="/user/usermastermanage/GRM0301/menuUserManage" />;
            }            
        }

        const { classes } = this.props;
        const { DashboardProps } = this.props;

        const clientOn = (DashboardProps.getIn(['clientStatus', 'clientOnCount'])) ?  DashboardProps.getIn(['clientStatus', 'clientOnCount']) : 0;
        const clientOff = (DashboardProps.getIn(['clientStatus', 'clientOffCount'])) ?  DashboardProps.getIn(['clientStatus', 'clientOffCount']) : 0;
        const clientRevoke = (DashboardProps.getIn(['clientStatus', 'clientRevokeCount'])) ?  DashboardProps.getIn(['clientStatus', 'clientRevokeCount']) : 0;

        const loginCount = (DashboardProps.getIn(['loginStatus', 'loginCount'])) ?  DashboardProps.getIn(['loginStatus', 'loginCount']) : 0;
        const userCount = (DashboardProps.getIn(['loginStatus', 'userCount'])) ?  DashboardProps.getIn(['loginStatus', 'userCount']) : 0;

        const noUpdateCount = (DashboardProps.getIn(['updateStatus', 'noUpdateCount'])) ?  DashboardProps.getIn(['updateStatus', 'noUpdateCount']) : 0;
        const updateCount = (DashboardProps.getIn(['updateStatus', 'updateCount'])) ?  DashboardProps.getIn(['updateStatus', 'updateCount']) : 0;
        const mainUpdateCount = (DashboardProps.getIn(['updateStatus', 'mainUpdateCount'])) ?  DashboardProps.getIn(['updateStatus', 'mainUpdateCount']) : 0;

        const violatedStatusInfo = (DashboardProps.get('violatedStatusInfo')) ?  DashboardProps.get('violatedStatusInfo') : 0;

        return (
            <GRPane>
            <Grid container spacing={24} style={{marginTop:20}}>
              <Grid item xs={12}>
                  <Grid container spacing={24}>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <ClientOnOff clientOn={clientOn} clientOff={clientOff} clientRevoke={clientRevoke} onLinkClick={this.handleClickLink} />
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <PackageUpdate noUpdateCount={noUpdateCount} updateCount={updateCount} mainUpdateCount={mainUpdateCount} onLinkClick={this.handleClickLink} />
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <UserLogin loginCount={loginCount} userCount={userCount} onLinkClick={this.handleClickLink} />
                        </Paper>
                    </Grid>
                  </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Paper className={classes.paper}>
                    <ViolatedStatus statusInfo={violatedStatusInfo} onChangeType={this.handleClickChangePeriod} periodType={DashboardProps.get('periodType')} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>
                    <ClientListForDashboard 
                        onClickViolatedItem={this.handleClickViolatedLink} 
                        onClickShowUserInfo={this.handleClickShowUserInfo}
                        onClickShowPackageInfo={this.handleClickPackageLink}
                    />
                </Paper>
              </Grid>

              {/* <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>-</Paper>
              </Grid> */}

            </Grid>
            <div style={{marginTop:20,display:'inline-flex',flex:'1 1 0'}} >
              <span>
              {(this.state.isRunningTimer) &&
                    <img src="/gpms/images/loading-icon-animated-gif.jpg" width="30" />
                }
              </span>
              <span>
              <Typography >{this.state.currentCount}</Typography>
              </span>
            </div>
            <UserInfoDialog onClose={this.handleClickCloseUserInfo} />
            </GRPane>
        );
    }
}

const mapStateToProps = (state) => ({
    DashboardProps: state.DashboardModule,
    AdminProps: state.AdminModule,
    SecurityLogProps: state.SecurityLogModule
});

const mapDispatchToProps = (dispatch) => ({
    DashboardActions: bindActionCreators(DashboardActions, dispatch),
    AdminActions: bindActionCreators(AdminActions, dispatch),
    SecurityLogActions: bindActionCreators(SecurityLogActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(Dashboard));


