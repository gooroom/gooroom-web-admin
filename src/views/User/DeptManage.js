import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from "material-ui/styles";
import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import GrPageHeader from "../../components/GrHeader/GrPageHeader";

import GrTreeList from "../../components/GrTree/GrTreeList";

import GrPane from "../../containers/Container/GrPane";

import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";

import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from "material-ui/Card";

//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

class DeptManage extends Component {
  constructor(props) {
    super(props);

    this.handleSelectDept = this.handleSelectDept.bind(this);
  }

  handleSelectDept(node) {
    console.log("..... DeptManage handleSelectDept... " + node.title);
  }

  render() {
    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={4}>
            <GrTreeList
            useFolderIcons={true}
            listHeight="24px"
            url="http://localhost:8080/gpms/readChildrenDeptList"
            paramKeyName="deptCd"
            rootKeyValue="000000000"
            keyName="key"
            title="title"
            startingDepth="2"
            onSelectNode={this.handleSelectDept}
          />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Paper>xs=12 sm=6</Paper>
            </Grid>
          </Grid>
        </GrPane>
      </React.Fragment>
    );
  }
}

export default DeptManage;
