import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getViewItem } from 'components/GRUtils/GRCommonUtils';

import * as UserActions from 'modules/UserModule';
import UserDialog from './UserDialog';
import UserRuleDialog from './UserRuleDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import BrowserRuleComp from 'views/Rules/UserConfig/BrowserRuleComp';
import MediaRuleComp from 'views/Rules/UserConfig/MediaRuleComp';
import SecurityRuleComp from 'views/Rules/UserConfig/SecurityRuleComp';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserRuleInform extends Component {

   // edit
   handleEditClick = (selectedViewItem) => {

    console.log('selectedViewItem :::::::::::::::::::: ', selectedViewItem.toJS());

    this.props.UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: selectedViewItem.get('userId'),
        userNm: selectedViewItem.get('userNm')
      },
      ruleDialogType: UserRuleDialog.TYPE_EDIT
    }, true);
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { UserProps, compId } = this.props;
    const informOpen = UserProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = UserProps.getIn(['viewItems', compId, 'selectedViewItem']);

    return (
      <div style={{marginTop: 10}} >
      {(informOpen && selectedViewItem) &&
        <Card>
          <CardHeader
            title={selectedViewItem.get('userNm')}
            subheader={selectedViewItem.get('userId') + ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD')}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(selectedViewItem)}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          />
          <Divider />

          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={12} lg={6} >
                <BrowserRuleComp compId={compId} targetType="USER" />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <MediaRuleComp compId={compId} targetType="USER" />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <SecurityRuleComp compId={compId} targetType="USER" />
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
  UserProps: state.UserModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserRuleInform));

