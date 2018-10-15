import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getViewItem } from 'components/GRUtils/GRCommonUtils';

import * as UserActions from 'modules/UserModule';
import * as DeptActions from 'modules/DeptModule';

import DeptDialog from './DeptDialog';

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

import DesktopConfigComp from 'views/Rules/DesktopConfig/DesktopConfigComp';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DeptRuleInform extends Component {

  // edit
  handleEditClick = (selectedDept) => {
    this.props.DeptActions.showDialog({
      selectedViewItem: {
        deptCd: selectedDept.get('selectedDeptCd'),
        deptNm: selectedDept.get('selectedDeptNm')
      },
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { UserProps, DeptProps, compId } = this.props;
    const informOpen = DeptProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedDept = DeptProps.getIn(['viewItems', compId]);

    return (
      <div style={{marginTop: 10}}>
      {(informOpen && selectedDept) &&
        <Card>
          <CardHeader
            title={selectedDept.get('selectedDeptNm')}
            subheader={selectedDept.get('selectedDeptCd')}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(selectedDept)}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={12} lg={6} >
                <BrowserRuleComp compId={compId} targetType="DEPT" inherit={true} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <MediaRuleComp compId={compId} targetType="DEPT" inherit={true} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6} >
                <SecurityRuleComp compId={compId} targetType="DEPT" inherit={true} />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfigComp compId={compId} targetType="DEPT" inherit={false} />
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
  UserActions: bindActionCreators(UserActions, dispatch),
  DeptActions: bindActionCreators(DeptActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptRuleInform));

