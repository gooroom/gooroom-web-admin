import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { css } from "glamor";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as PackageManageActions from 'modules/PackageManageModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { grLayout } from "templates/default/GrLayout";
import { grColor } from "templates/default/GrColors";
import { grRequestPromise } from "components/GrUtils/GrRequester";

import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrTreeList from "components/GrTree/GrTreeList";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';


//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
paddingTop: "14px !important"
}).toString();

const listItems = [{title: "one"}];



class PackageManage extends Component {

constructor(props) {
  super(props);
}

render() {

  const { jobManageModule, grConfirmModule } = this.props;

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

export default connect(mapStateToProps, mapDispatchToProps)(PackageManage);


