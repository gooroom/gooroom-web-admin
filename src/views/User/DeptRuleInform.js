import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getViewItem } from 'components/GrUtils/GrCommonUtils';

import * as UserActions from 'modules/UserModule';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import BrowserRuleComp from 'views/Rules/UserConfig/BrowserRuleComp';
import MediaRuleComp from 'views/Rules/UserConfig/MediaRuleComp';
import SecurityRuleComp from 'views/Rules/UserConfig/SecurityRuleComp';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DeptRuleInform extends Component {

  // .................................................

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { UserProps, DeptProps, compId } = this.props;
    const informOpen = UserProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedDept = DeptProps.getIn(['viewItems', compId]);

    return (
      <div style={{marginTop: 10}} >
      {informOpen &&
        <Card>
          <CardHeader
            title={selectedDept.get('selectedDeptNm')}
            subheader={selectedDept.get('selectedDeptCd')}
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={12} lg={6} >
                <BrowserRuleComp compId={compId} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <MediaRuleComp compId={compId} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <SecurityRuleComp compId={compId} />
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
  UserProps: state.UserModule,
  DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(DeptRuleInform));

