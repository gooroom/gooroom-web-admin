import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import  { Redirect } from 'react-router-dom';

import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import ProtectedClientDialog from "views/Client/ProtectedClientDialog";

import Badge from '@material-ui/core/Badge';

import AdminDialog from './AdminDialog';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
import Search from '@material-ui/icons/Search';

import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';




import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class GRAlarmInform extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpenProtectedData: false
    };
  }

  componentDidMount() {
    this.protectedTimer = setInterval(()=> this.getProtectedData(), 10000);
  }
  
  componentWillUnmount() {
    clearInterval(this.protectedTimer)
    this.protectedTimer = null; // here...
  }

  getProtectedData() {
    const { AdminActions } = this.props;
    AdminActions.readProtectedClientCount();
  }

  handleClickAlarm = (e) => {
    this.setState({
      isOpenProtectedData: true
    });
  }

  handleClickCloseDialog() {
    this.setState({
      isOpenProtectedData: false
    });
  }

  // .................................................
  render() {
    const { classes } = this.props;
    const { AdminProps } = this.props;

    const protectedCount = AdminProps.get('protectedCount');
    let bellIcon = null;
    let invisible = true;
    if(protectedCount && protectedCount > 0) {
      bellIcon = <NotificationsActiveIcon />;
      invisible = false;
    } else {
      bellIcon = <NotificationsOffIcon />;
    }

    return (
      <React.Fragment>
      <IconButton onClick={this.handleClickAlarm}>
        <Badge badgeContent={protectedCount} color="secondary" invisible={invisible} >
          {bellIcon}
        </Badge>
      </IconButton>
      <ProtectedClientDialog 
        isOpen={this.state.isOpenProtectedData} 
        onClose={this.handleClickCloseDialog} 
      />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminActions: bindActionCreators(AdminActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GRAlarmInform));

