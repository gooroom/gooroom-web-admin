import React, {Component} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie} from 'recharts';

import GRPane from 'containers/GRContent/GRPane';

import ClientOnOff from './ClientOnOff';
import ClientProtected from './ClientProtected';
import UserLogin from './UserLogin';

import NivoPieTest from './NivoPieTest';


import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class Dashboard extends Component {

    render() {
        const { classes } = this.props;

        return (
            <GRPane>
                
            <Grid container spacing={24} style={{marginTop:20}}>

              <Grid item xs={12}>
                  <Grid container spacing={24}>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                            <ClientOnOff />
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <Paper className={classes.paper}>
                        <NivoPieTest />
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
                
                <NivoPieTest />
                
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

export default withStyles(GRCommonStyle)(Dashboard);
