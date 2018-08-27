import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import * as MediaControlSettingActions from 'modules/MediaControlSettingModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class UserListComp extends Component {

  componentDidMount() {
    console.log('UserListComp > componentDidMount ..........', this.props);

    const { compId } = this.props;

    console.log('UserListComp > componentDidMount : compId -> ', compId);
  }

  // .................................................

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let selectedViewItem = null;

    return (
      <div>UserListComp
      </div>
    );

  }
}

export default withStyles(GrCommonStyle)(UserListComp);

