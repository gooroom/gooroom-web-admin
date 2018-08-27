import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import GrPageHeader from "containers/GrContent/GrPageHeader";

import GrTreeList from "components/GrTree/GrTreeList";
import GrPane from "containers/GrContent/GrPane";

import UserListComp from 'views/User/UserListComp';

import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


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

    console.log('handleSelectDept >> ', node);

    this.setState({
      deptName: node.title,
      deptId: node.key
    });
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { deptName, deptId } = this.state;

    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} style={{border: "1px sold red"}} />
        <GrPane>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={5}>
              <Card className={classes.deptTreeCard}>
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
              <Card className={classes.deptInfoCard}>
                <CardContent>
                  <Typography className={classes.deptTitle} color="textSecondary">
                  조직 정보
                  </Typography>
                  <Typography variant="headline" component="h2">
                  {deptName}
                  </Typography>
                  <Typography className={classes.deptId} color="textSecondary">
                  {bull} ID - {deptId}
                  </Typography>
                  <Typography component="p">
                    {bull} {'"이 조직에 대한 설명 또는 상세 정보"'}
                  </Typography>
                
                </CardContent>
              </Card>
              <Card className={classes.deptUserCard}>
                <CardContent>
                  <Typography className={classes.deptTitle} color="textSecondary">
                  사용자 정보
                  </Typography>
                  <UserListComp 
                    name="UserListComp"
                    compId="DeptManage"
                    deptCd="11111"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </GrPane>
      </React.Fragment>
    );
  }
}

export default withStyles(GrCommonStyle)(DeptManage);


