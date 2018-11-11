import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getViewItem } from 'components/GRUtils/GRCommonUtils';

import * as UserActions from 'modules/UserModule';
import * as DeptActions from 'modules/DeptModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';
import * as SoftwareFilterActions from 'modules/SoftwareFilterModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';

import DeptDialog from './DeptDialog';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import BrowserRuleDialog from 'views/Rules/UserConfig/BrowserRuleDialog';
import BrowserRuleSpec from 'views/Rules/UserConfig/BrowserRuleSpec';
import MediaRuleDialog from 'views/Rules/UserConfig/MediaRuleDialog';
import MediaRuleSpec from 'views/Rules/UserConfig/MediaRuleSpec';
import SecurityRuleDialog from 'views/Rules/UserConfig/SecurityRuleDialog';
import SecurityRuleSpec from 'views/Rules/UserConfig/SecurityRuleSpec';
import SoftwareFilterDialog from 'views/Rules/UserConfig/SoftwareFilterDialog';
import SoftwareFilterSpec from 'views/Rules/UserConfig/SoftwareFilterSpec';
import DesktopConfDialog from 'views/Rules/DesktopConfig/DesktopConfDialog';
import DesktopConfSpec from 'views/Rules/DesktopConfig/DesktopConfSpec';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DeptSpec extends Component {

  // edit
  handleEditClick = (paramObj) => {
    this.props.DeptActions.showDialog({
      viewItem: {
        deptCd: paramObj.get('selectedDeptCd'),
        deptNm: paramObj.get('selectedDeptNm')
      },
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  // ===================================================================
  handleEditClickForMediaRule = (viewItem, compType) => {
    //const viewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(MediaRuleProps, compId, targetType);
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
  handleEditClickForSoftwareFilter = (viewItem, compType) => {
    this.props.SoftwareFilterActions.showDialog({
      viewItem: viewItem,
      dialogType: SoftwareFilterDialog.TYPE_EDIT
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
    const bull = <span className={classes.bullet}>•</span>;

    const { UserProps, DeptProps, compId } = this.props;

    const informOpen = DeptProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = DeptProps.getIn(['viewItems', compId]);

    const selectedMediaRuleItem = this.props.MediaRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedBrowserRuleItem = this.props.BrowserRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedSecurityRuleItem = this.props.SecurityRuleProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedSoftwareFilterItem = this.props.SoftwareFilterProps.getIn(['viewItems', compId, 'DEPT']);
    const selectedDesktopConfItem = this.props.DesktopConfProps.getIn(['viewItems', compId, 'DEPT']);

    return (
      <div style={{marginTop: 10}}>
      {(informOpen && viewItem) &&
        <Card>
          <CardHeader
            title={viewItem.get('selectedDeptNm')}
            subheader={viewItem.get('selectedDeptCd')}
            action={
              <div style={{width:48,paddingTop:10}}>
                <Button size="small"
                  variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={() => this.handleEditClick(viewItem)}
                ><SettingsApplicationsIcon /></Button>
              </div>
            }
          ></CardHeader>
          <Divider />
          <CardContent style={{padding:10}}>
            <Grid container spacing={16}>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <BrowserRuleSpec compId={compId}
                  specType="inform" targetType="DEPT"
                  selectedItem={selectedBrowserRuleItem}
                  onClickEdit={this.handleEditClickForBrowserRule}
                  inherit={viewItem.get('hasChildren')}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <MediaRuleSpec compId={compId}
                  specType="inform" targetType="DEPT"
                  selectedItem={selectedMediaRuleItem}
                  onClickEdit={this.handleEditClickForMediaRule}
                  inherit={viewItem.get('hasChildren')}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SecurityRuleSpec compId={compId}
                  specType="inform" targetType="DEPT"
                  selectedItem={selectedSecurityRuleItem}
                  onClickEdit={this.handleEditClickForSecurityRule}
                  inherit={viewItem.get('hasChildren')}
                />
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={4} >
                <SoftwareFilterSpec compId={compId}
                  specType="inform" targetType="DEPT"
                  selectedItem={selectedSoftwareFilterItem}
                  onClickEdit={this.handleEditClickForSoftwareFilter}
                  inherit={viewItem.get('hasChildren')}
                />
              </Grid>
              <Grid item xs={12} sm={12} lg={12}>
                <DesktopConfSpec compId={compId}
                  specType="inform" targetType="DEPT" 
                  selectedItem={selectedDesktopConfItem}
                  onClickEdit={this.handleEditClickForDesktopConf}
                  inherit={viewItem.get('hasChildren')} />
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
  DeptProps: state.DeptModule,
  MediaRuleProps: state.MediaRuleModule,
  BrowserRuleProps: state.BrowserRuleModule,
  SecurityRuleProps: state.SecurityRuleModule,
  SoftwareFilterProps: state.SoftwareFilterModule,
  DesktopConfProps: state.DesktopConfModule
});

const mapDispatchToProps = (dispatch) => ({
  UserActions: bindActionCreators(UserActions, dispatch),
  DeptActions: bindActionCreators(DeptActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),
  SoftwareFilterActions: bindActionCreators(SoftwareFilterActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptSpec));

