import React, { Component } from "react";
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import SecurityRuleDialog from './SecurityRuleDialog';
import { generateConfigObject } from './SecurityRuleInform';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId } from 'components/GrUtils/GrTableListUtils';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class SecurityRuleComp extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { SecurityRuleProps, SecurityRuleActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(SecurityRuleProps, compId, 'objId') : getSelectedObjectInComp(SecurityRuleProps, compId);

    SecurityRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: SecurityRuleDialog.TYPE_EDIT
    });
  };

  render() {

    const { classes } = this.props;
    const { SecurityRuleProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = SecurityRuleProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = SecurityRuleProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    const viewCompItem = (compType != 'VIEW') ? generateConfigObject(selectedViewItem) : 
      (() => {
        if(listAllData && selectedOptionItemId != null) {
          const item = listAllData.find((element) => {
            return element.get('objId') == selectedOptionItemId;
          });
          if(item) {
            return generateConfigObject(fromJS(item.toJS()));
          } else {
            return null;
          }
        }
      })()
    ;

    return (
      <React.Fragment>
      <Card elevation={0}>
        {(viewCompItem) && <CardContent style={{padding: 0}}>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                {(compType == 'VIEW') ? '상세내용' : '단말보안정책'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="flex-end">
                <Button size="small"
                  variant="outlined" color="primary"
                  onClick={() => this.handleEditBtnClick(viewCompItem.get('objId'), compType)}
                ><SettingsApplicationsIcon />수정</Button>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewCompItem.get('objNm')}
          </Typography>
          <Typography color="textSecondary">
            {(viewCompItem.get('comment') != '') ? '"' + viewCompItem.get('comment') + '"' : ''}
          </Typography>
          <Divider />
          {(viewCompItem && viewCompItem.get('objId') != '') &&
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 화면보호기 설정시간(분)</TableCell>
                  <TableCell numeric>{viewCompItem.get('screenTime')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 패스워드 변경주기(일)</TableCell>
                  <TableCell numeric>{viewCompItem.get('passwordTime')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 패키지추가/삭제 기능</TableCell>
                  <TableCell numeric>{viewCompItem.get('packageHandle')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 전체네트워크허용</TableCell>
                  <TableCell numeric>{viewCompItem.get('state')}</TableCell>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                </TableRow>

              </TableBody>
            </Table>
          }
          </CardContent>
        }
      </Card>
      <SecurityRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(SecurityRuleComp));

