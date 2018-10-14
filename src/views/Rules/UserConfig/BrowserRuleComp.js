import React, { Component } from "react";
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';

import BrowserRuleDialog from './BrowserRuleDialog';
import { generateConfigObject } from './BrowserRuleInform';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getRoleTitleClassName } from 'components/GRUtils/GRTableListUtils';

import Card from '@material-ui/core/Card';
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
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class BrowserRuleComp extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { BrowserRuleProps, BrowserRuleActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleProps, compId, 'objId') : getSelectedObjectInComp(BrowserRuleProps, compId);

    BrowserRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: BrowserRuleDialog.TYPE_EDIT
    });
  };

  handleInheritBtnClick = (objId, compType) => {
    const { BrowserRuleProps, BrowserRuleActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleProps, compId, 'objId') : getSelectedObjectInComp(BrowserRuleProps, compId);

    BrowserRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: BrowserRuleDialog.TYPE_INHERIT
    });
  };

  render() {

    const { classes } = this.props;
    const { BrowserRuleProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = BrowserRuleProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = BrowserRuleProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = BrowserRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    const isDefault = BrowserRuleProps.getIn(['viewItems', compId, 'isDefault']);
    const isDeptRole = BrowserRuleProps.getIn(['viewItems', compId, 'isDeptRole']);

    const titleClassName = getRoleTitleClassName(this.props.targetType, isDefault, isDeptRole);

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
        {(!viewCompItem) && 
          <Card elevation={0}>
          <CardContent style={{padding: 10}}>
            <Grid container>
              <Grid item xs={6}>
                <Typography className={classes.compTitleForEmpty}>브라우져제어정책</Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-end">
                없음
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          </Card>
        }
        {(viewCompItem) && 
          <Card elevation={0}>
          <CardContent style={{padding: 10}}>
            <Grid container>
              <Grid item xs={6}>
                <Typography className={classes[titleClassName]}>
                  {(compType == 'VIEW') ? '상세내용' : '브라우져제어정책'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-end">
                  {(this.props.inherit) && 
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.handleInheritBtnClick(viewCompItem.get('objId'), compType)}
                  ><ArrowDropDownCircleIcon /></Button>
                  }
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h5" component="h2">
              {viewCompItem.get('objNm')}
              <Button size="small"
                variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                onClick={() => this.handleEditBtnClick(viewCompItem.get('objId'), compType)}
              ><SettingsApplicationsIcon /></Button>
            </Typography>
            <Typography color="textSecondary">
            {(viewCompItem.get('objId') != '') ? '(' + viewCompItem.get('objId') + ') ' : ''}
            {(viewCompItem.get('comment') != '') ? '"' + viewCompItem.get('comment') + '"' : ''}
            </Typography>
            <Divider />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{viewCompItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{viewCompItem.get('webWorker')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{viewCompItem.get('trustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{viewCompItem.get('untrustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{viewCompItem.get('trustUrlList').map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        }
      <BrowserRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(BrowserRuleComp));

