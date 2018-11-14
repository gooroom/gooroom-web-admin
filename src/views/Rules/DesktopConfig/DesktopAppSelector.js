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
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
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
    const { DesktopConfProps, DesktopConfActions } = this.props;
    this.props.GRAlertActions.showAlert({
      alertTitle: "시스템알림",
      alertMsg: "현재 데스크톱 앱 삭제는 '데스크톱앱관리' 메뉴에서만 실행 되도록 설정되어 있습니다."
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

    let appAllDatas = (DesktopAppProps.get('listAllData')) ? DesktopAppProps.get('listAllData') : List([]);

    // let selectedAppDatas = List([]);
    // if(selectedApps && selectedApps.size > 0) {
    //   selectedApps.forEach(e => {
    //     const appObj = appAllDatas.find((n) => {
    //       return n.get('appId') == e.get('appId');
    //     });
    //     if(appObj) {
    //       selectedAppDatas = selectedAppDatas.push(appObj);
    //     }
    //   });
    // }
    
    return (
      <React.Fragment>
        <Typography variant="subtitle2" style={{marginBottom:0}} gutterBottom>앱리스트  (아래 전체앱리스트에서 앱을 추가 할 수 있습니다.)</Typography>
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


        <Typography variant="h5" style={{marginTop:20}} gutterBottom> 전체 앱 리스트 </Typography>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppSelector));
