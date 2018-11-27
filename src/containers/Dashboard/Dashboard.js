import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie} from 'recharts';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DashboardActions from 'modules/DashboardModule';

import GRPane from 'containers/GRContent/GRPane';

import ClientOnOff from './ClientOnOff';
import ClientProtected from './ClientProtected';
import UserLogin from './UserLogin';

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class Dashboard extends Component {

    componentDidMount() {
        const { DashboardActions, DashboardProps } = this.props;
        DashboardActions.readClientStatusForDashboard();
    }

    render() {
        const { classes } = this.props;
        const { DashboardProps } = this.props;

        const clientOn = (DashboardProps.get('clientOnCount')) ?  DashboardProps.get('clientOnCount') : 0;
        const clientOff = (DashboardProps.get('clientOffCount')) ?  DashboardProps.get('clientOffCount') : 0;
        const clientRevoke = (DashboardProps.get('clientRevokeCount')) ?  DashboardProps.get('clientRevokeCount') : 0;
        return (
            <GRPane>
                
            <Grid container spacing={24} style={{marginTop:20}}>

              <Grid item xs={12}>
                  <Grid container spacing={24}>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <ClientOnOff clientOn={clientOn} clientOff={clientOff} clientRevoke={clientRevoke}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <ClientProtected />
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <UserLogin />
                        </Paper>
                    </Grid>
                  </Grid>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>xs=12</Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>xs=12 sm=6</Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className={classes.paper}>xs=12 sm=6</Paper>
              </Grid>


            </Grid>

            </GRPane>
      
        );
        
    }
}

const mapStateToProps = (state) => ({
    DashboardProps: state.DashboardModule
});

const mapDispatchToProps = (dispatch) => ({
    DashboardActions: bindActionCreators(DashboardActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(Dashboard));


