import React, {Component} from 'react';
import { Redirect } from 'react-router';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DashboardActions from 'modules/DashboardModule';

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

    render() {
        if (this.state.redirect) {
            if(this.state.linkType == 'package') {
                return <Redirect push to ='/package/packagemanage/GRM0201/패키지관리' />;
            } else if(this.state.linkType == 'client') {
                return <Redirect push to="/clients/clientmastermanage/GRM0101/단말관리" />;
            } else if(this.state.linkType == 'user') {
                return <Redirect push to="/user/usermastermanage/GRM0301/사용자관리" />;
            }            
        }

        const { classes } = this.props;
        const { DashboardProps } = this.props;

        const clientOn = (DashboardProps.get('clientOnCount')) ?  DashboardProps.get('clientOnCount') : 0;
        const clientOff = (DashboardProps.get('clientOffCount')) ?  DashboardProps.get('clientOffCount') : 0;
        const clientRevoke = (DashboardProps.get('clientRevokeCount')) ?  DashboardProps.get('clientRevokeCount') : 0;

        const loginCount = (DashboardProps.get('loginCount')) ?  DashboardProps.get('loginCount') : 0;
        const userCount = (DashboardProps.get('userCount')) ?  DashboardProps.get('userCount') : 0;

        const noUpdateCount = (DashboardProps.get('noUpdateCount')) ?  DashboardProps.get('noUpdateCount') : 0;
        const updateCount = (DashboardProps.get('updateCount')) ?  DashboardProps.get('updateCount') : 0;
        const mainUpdateCount = (DashboardProps.get('mainUpdateCount')) ?  DashboardProps.get('mainUpdateCount') : 0;

        const violatedStatusInfo = (DashboardProps.get('violatedStatusInfo')) ?  DashboardProps.get('violatedStatusInfo') : 0;

        return (
            <GRPane>
                {(this.state.isRunningTimer) &&
                    <img src="http://localhost:8080/gpms/images/loading-icon-animated-gif.jpg" width="30" />
                }
                <Typography >{this.state.currentCount}</Typography>
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
                    <ClientListForDashboard />
                </Paper>
              </Grid>

              {/* <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>-</Paper>
              </Grid> */}

            </Grid>

            </GRPane>
      
        );
        
    }
}

const mapStateToProps = (state) => ({
    DashboardProps: state.DashboardModule,
    AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
    DashboardActions: bindActionCreators(DashboardActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(Dashboard));


