import React, {Component} from 'react';
import { connect } from 'react-redux';

import GRPane from 'containers/GRContent/GRPane';

import Grid from "@material-ui/core/Grid";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


class PartMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentCount: 0
        };
    }

    render() {

        return (
            <GRPane>
            <Grid container spacing={24} style={{marginTop:20}}>
              <Grid item xs={12} style={{textAlign:'center',fontWeight: 'bold',fontSize: 'x-large',paddingTop: '72px'}}>
              Gooroom Platform Management System
              </Grid>
            </Grid>
            </GRPane>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PartMain));


