import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import { grLayout } from "../../templates/default/GrLayout";
import { grColor } from "../../templates/default/GrColors";
import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import GrPageHeader from "../../containers/GrContent/GrPageHeader";

import GrTreeList from "../../components/GrTree/GrTreeList";
import GrPane from "../../containers/GrContent/GrPane";

import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

//
//  ## Style ########## ########## ########## ########## ##########
//
const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const treeCardClass = css({
  minHeight: "600px !important"
}).toString();

const deptInfoCardClass = css({
  marginBottom: "0px",
}).toString();

const deptUserCardClass = css({
  marginTop: "20px",
}).toString();


const bulletClass = css({
  display: "inline-block",
  margin: "0 2px",
  transform: "scale(0.8)",
}).toString();

const titleClass = css({
  marginBottom: "16px",
  fontSize: "14px",
}).toString();

const posClass = css({
  marginBottom: "12px",
}).toString();

class DeptManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deptName: "",
      deptId: ""
    }

    this.handleSelectDept = this.handleSelectDept.bind(this);
  }

  handleSelectDept(node) {
    this.setState({
      deptName: node.title,
      deptId: node.key
    });
  }

  render() {
    const bull = <span className={bulletClass}>•</span>;

    const { deptName, deptId } = this.state;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={5}>
              <Card className={treeCardClass}>
                <GrTreeList
                  useFolderIcons={true}
                  listHeight="24px"
                  url="readChildrenDeptList"
                  paramKeyName="deptCd"
                  rootKeyValue="000000000"
                  keyName="key"
                  title="title"
                  startingDepth="2"
                  onSelectNode={this.handleSelectDept}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Card className={deptInfoCardClass}>
                <CardContent>
                  <Typography className={titleClass} color="textSecondary">
                  조직 정보
                  </Typography>
                  <Typography variant="headline" component="h2">
                  {deptName}
                  </Typography>
                  <Typography className={posClass} color="textSecondary">
                  {bull} ID - {deptId}
                  </Typography>
                  <Typography component="p">
                    {bull} {'"이 조직에 대한 설명 또는 상세 정보"'}
                  </Typography>
                
                </CardContent>
              </Card>
              <Card className={deptUserCardClass}>
                <CardContent>
                  <Typography className={titleClass} color="textSecondary">
                  사용자 정보
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </GrPane>
      </React.Fragment>
    );
  }
}

export default DeptManage;
