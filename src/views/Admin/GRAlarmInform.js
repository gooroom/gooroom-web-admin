import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AdminActions from 'modules/AdminModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import ViolatedClientDialog from "views/Client/ViolatedClientDialog";

import Badge from '@material-ui/core/Badge';

import IconButton from '@material-ui/core/IconButton';

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
      isOpenViolatedData: false,
    };
  }

  componentDidMount() {
    clearInterval(this.violatedTimer)
    this.violatedTimer = null;
    this.violatedTimer = setInterval(()=> this.getViolatedData(), 20000);
  }
  
  componentWillUnmount() {
    clearInterval(this.violatedTimer)
    this.violatedTimer = null; // here...
  }

  getViolatedData() {
    const { AdminActions } = this.props;
    AdminActions.readViolatedClientCount();
  }

  handleClickAlarm = (e) => {
    this.props.AdminActions.showViolatedListDialog();
  }

  handleClickCloseDialog = (e) => {
    this.props.AdminActions.closeViolatedListDialog();
  }

  // .................................................
  render() {
    const { classes } = this.props;
    const { AdminProps } = this.props;

    const violatedCount = (AdminProps.get('violatedCount')) ? (AdminProps.get('violatedCount')) : 0;
    let bellIcon = null;
    let invisible = true;
    if(violatedCount && violatedCount > 0) {
      bellIcon = <NotificationsActiveIcon />;
      invisible = false;
    } else {
      bellIcon = <NotificationsOffIcon />;
    }

    return (
      <React.Fragment>
      <IconButton onClick={this.handleClickAlarm}>
        <Badge badgeContent={violatedCount} color="secondary" invisible={invisible} >
          {bellIcon}
        </Badge>
      </IconButton>
      <ViolatedClientDialog 
        isOpen={this.state.isOpenViolatedData} 
        onClickItem={this.handleClickLink}
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

