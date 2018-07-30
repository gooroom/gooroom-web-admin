import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PackageManageActions from 'modules/PackageManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

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
  grConfirmModule: state.GrConfirmModule,

});


const mapDispatchToProps = (dispatch) => ({

  PackageManageActions: bindActionCreators(PackageManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(PackageManage));


