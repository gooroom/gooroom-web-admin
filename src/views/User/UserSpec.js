import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getViewItem } from 'components/GRUtils/GRCommonUtils';

import * as UserActions from 'modules/UserModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

import UserDialog from './UserDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserSpec extends Component {

   // edit
   handleEditClick = (viewItem) => {
    this.props.UserActions.showDialog({
      ruleSelectedViewItem: {
        userId: viewItem.get('userId'),
        userNm: viewItem.get('userNm'),
        deptCd: viewItem.get('deptCd'),
        deptNm: viewItem.get('deptNm')
      },
      ruleDialogType: UserDialog.TYPE_EDIT
    }, true);
  };

  // ===================================================================
  handleEditClickForMediaRule = (viewItem, compType) => {
    this.props.MediaRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForBrowserRule = (viewItem, compType) => {
    this.props.BrowserRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForSecurityRule = (viewItem, compType) => {
    this.props.SecurityRuleActions.showDialog({
      viewItem: viewItem,
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };
  handleEditClickForDesktopConf = (viewItem, compType) => {
    this.props.DesktopConfActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopConfDialog.TYPE_EDIT
    });
  };
  // ===================================================================


  // .................................................
  render() {
    const { classes } = this.props;
    const { UserProps, compId } = this.props;

    const informOpen = UserProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = UserProps.getIn(['viewItems', compId, 'viewItem']);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'USER']);
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'USER']);

    return (
      <div style={{marginTop: 10}} >
      {(informOpen && viewItem) &&
        <Card>
          <CardHeader
            title={viewItem.get('userNm')}
            subheader={viewItem.get('userId') + ', ' + formatDateToSimple(viewItem.get('regDate'), 'YYYY-MM-DD')}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(viewItem)}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          />
          <Divider />

          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item md={12} lg={6} xl={4} >
                <BrowserRuleSpec compId={compId}
                  specType="inform" targetType="USER"
                  selectedItem={selectedBrowserRuleItem}
                  onClickEdit={this.handleEditClickForBrowserRule}
                />
              </Grid>
              <Grid item md={12} lg={6} xl={4} >
                <MediaRuleSpec compId={compId}
                  specType="inform" targetType="USER"
                  selectedItem={selectedMediaRuleItem}
                  onClickEdit={this.handleEditClickForMediaRule}
                />
              </Grid>
              <Grid item md={12} lg={6} xl={4} >
                <SecurityRuleSpec compId={compId}
                  specType="inform" targetType="USER"
                  selectedItem={selectedSecurityRuleItem}
                  onClickEdit={this.handleEditClickForSecurityRule}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId}
                  specType="inform" targetType="USER" 
                  selectedItem={selectedDesktopConfItem}
                  onClickEdit={this.handleEditClickForDesktopConf}
                />
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
  MediaRuleProps: state.MediaRuleModule,
  BrowserRuleProps: state.BrowserRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserSpec));

