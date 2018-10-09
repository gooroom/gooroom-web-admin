import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientPackageInform extends Component {

  render() {

    const { compId, ClientPackageProps } = this.props;
    const informOpen = ClientPackageProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = ClientPackageProps.getIn(['viewItems', compId, 'selectedViewItem']);

    let packageInfo = '';
    if(selectedViewItem) {
      packageInfo = selectedViewItem.get('packageId');
      if(selectedViewItem.get('regDate') && selectedViewItem.get('regDate') !== '') {
        packageInfo += ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD');
      }
      if(selectedViewItem.get('comment') && selectedViewItem.get('comment') !== '') {
        packageInfo += ', ' + selectedViewItem.get('comment');
      }
    }

    return (
      <div style={{marginTop: 10}} >
      {(informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={selectedViewItem.get('packageId')}
            subheader={packageInfo}
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} lg={6}>
              Package Inform
              </Grid>
            </Grid>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientPackageInform));

