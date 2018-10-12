import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PackageManageActions from 'modules/PackageManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class PackageManage extends Component {

constructor(props) {
  super(props);
}

render() {
  const { classes } = this.props;

  return (

    <React.Fragment>
    </React.Fragment>
    
  );
}


}


const mapStateToProps = (state) => ({

  packageManageModule: state.PackageManageModule,
  grConfirmModule: state.GRConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  PackageManageActions: bindActionCreators(PackageManageActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(PackageManage));


