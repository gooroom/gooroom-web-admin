import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as DesktopConfActions from 'modules/DesktopConfModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRAlert from 'components/GRComponents/GRAlert';

import DesktopApp from './DesktopApp';
import DesktopAppDialog from 'views/Rules/DesktopConfig/DesktopApp/DesktopAppDialog';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DesktopAppSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedObj: {},
    };
  }

  componentDidMount() {
    this.props.DesktopAppActions.readDesktopAppAllList();
  }

  handleAddClick = appObj => {
    const { DesktopConfProps, DesktopConfActions } = this.props;
    // add to selected items
    let selectedApps = DesktopConfProps.getIn(['editingItem', 'apps']);
    selectedApps = (selectedApps) ? selectedApps.push(appObj) : List([appObj]);
    DesktopConfActions.setEditingItemValue({ name: 'apps', value: selectedApps });
  }

  handleEditAppClick = (viewItem) => {
    this.props.DesktopAppActions.showDialog({
      viewItem: viewItem,
      dialogType: DesktopAppDialog.TYPE_EDIT_INCONF
    });
  };

  handleDeleteApp = appId => {
    const { t, i18n } = this.props;
    this.props.GRAlertActions.showAlert({
      alertTitle: t("dtSystemNotice"),
      alertMsg: t("msgHelpDeleteApp")
    });
  }

  handleDeleteSelected = appId => {
    const { DesktopConfProps, DesktopConfActions } = this.props;
    // add to selected items
    let selectedApps = DesktopConfProps.getIn(['editingItem', 'apps']);
    selectedApps = (selectedApps) ? selectedApps.filter((e, v) => (e.get('appId') != appId)) : List([]);
    DesktopConfActions.setEditingItemValue({ name: 'apps', value: selectedApps });
  }

  isSelected = (appId) => {
    const { selectedApps } = this.props;
    if(selectedApps && selectedApps.size > 0) {
      return (selectedApps.findKey(x => x.get('appId') == appId) !== undefined) ? true : false;
    } else {
      return false;
    }
  }

  // .................................................
  render() {

    const { classes } = this.props;
    const { DesktopAppProps, selectedApps } = this.props;
    const { t, i18n } = this.props;

    let appAllDatas = (DesktopAppProps.get('listAllData')) ? DesktopAppProps.get('listAllData') : List([]);
    
    return (
      <React.Fragment>
        <Typography variant="subtitle2" style={{marginBottom:0}} gutterBottom>{t("msgAppList")}</Typography>
        <div style={{height:260,overflowX:'auto',border:'1px solid #cecece'}}>
          <Grid container spacing={16} direction="row" justify="flex-start" 
              alignItems="flex-start" style={{width:2000,margin:20}}
          >
          {selectedApps && selectedApps.map(n => {
              return (
              <Grid key={n.get('appId')} item>
                  <DesktopApp key={n.get('appId')} appObj={n}
                      hasAction={true}
                      type='select'
                      themeId={(n.get('themeId')) ? n.get('themeId') : '1'}
                      onEditClick={this.handleEditAppClick}
                      onDeleteClick={this.handleDeleteSelected}
                      isSelected={true}
                  />
              </Grid>
              );
          })}
          </Grid>
        </div>      


        <Typography variant="h5" style={{marginTop:20}} gutterBottom> {t("lbAppAllList")}</Typography>
        <div style={{height:280,overflowY:'auto',border:'1px solid #cecece'}}>
          <Grid container spacing={16} direction="row" justify="flex-start" 
              alignItems="flex-start" style={{width:'inherit',margin:20}}
          >
          {appAllDatas && appAllDatas.size > 0 && appAllDatas.map(n => {
              return (
              <Grid key={n.get('appId')} item>
                  <DesktopApp key={n.get('appId')} appObj={n}
                      hasAction={true}
                      type='main'
                      themeId={(n.get('themeId')) ? n.get('themeId') : '1'}
                      onAddClick={this.handleAddClick}
                      onEditClick={this.handleEditAppClick}
                      onDeleteClick={this.handleDeleteApp}
                      isSelected={this.isSelected(n.get('appId'))}
                  />
              </Grid>
              );
          })}
          </Grid>
        </div>

      <GRAlert />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DesktopConfProps: state.DesktopConfModule,
  DesktopAppProps: state.DesktopAppModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
  DesktopConfActions: bindActionCreators(DesktopConfActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppSelector)));
