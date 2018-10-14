import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import { getRowObjectById } from 'components/GRUtils/GRTableListUtils';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import ClientGroupDialog from './ClientGroupDialog';

import ClientConfSettingComp from 'views/Rules/ClientConfig/ClientConfSettingComp';
import ClientHostNameComp from 'views/Rules/HostName/ClientHostNameComp';
import ClientUpdateServerComp from 'views/Rules/UpdateServer/ClientUpdateServerComp';
import BrowserRuleComp from 'views/Rules/UserConfig/BrowserRuleComp';
import MediaRuleComp from 'views/Rules/UserConfig/MediaRuleComp';
import SecurityRuleComp from 'views/Rules/UserConfig/SecurityRuleComp';

import DesktopConfigComp from 'views/Rules/DesktopConfig/DesktopConfigComp';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientGroupInform extends Component {

  // edit
  handleEditClick = (id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const selectedViewItem = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    ClientGroupActions.showDialog({
      selectedViewItem: selectedViewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  render() {

    const { compId, ClientGroupProps } = this.props;
    const informOpen = ClientGroupProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = ClientGroupProps.getIn(['viewItems', compId, 'selectedViewItem']);

    let groupInfo = '';
    if(selectedViewItem) {
      groupInfo = selectedViewItem.get('grpId');
      if(selectedViewItem.get('regDate') && selectedViewItem.get('regDate') !== '') {
        groupInfo += ', ' + formatDateToSimple(selectedViewItem.get('regDate'), 'YYYY-MM-DD');
      }
      if(selectedViewItem.get('comment') && selectedViewItem.get('comment') !== '') {
        groupInfo += ', ' + selectedViewItem.get('comment');
      }
    }

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card >
          <CardHeader
            title={selectedViewItem.get('grpNm')}
            subheader={groupInfo}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(selectedViewItem.get('grpId'))}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={0}>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientConfSettingComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientHostNameComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <ClientUpdateServerComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <BrowserRuleComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <MediaRuleComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={6}>
                <SecurityRuleComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfigComp compId={compId} targetType="CLIENTGROUP" inherit={false} />
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
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupInform));

