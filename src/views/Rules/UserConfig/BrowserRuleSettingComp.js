import React, { Component } from "react";
import { fromJS } from 'immutable';
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getDataObjectInComp } from 'components/GrUtils/GrTableListUtils';

import * as BrowserRuleSettingActions from 'modules/BrowserRuleSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import BrowserRuleSettingDialog from './BrowserRuleSettingDialog';
import { generateConfigObject } from './BrowserRuleSettingInform';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId } from 'components/GrUtils/GrTableListUtils';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';

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
class BrowserRuleSettingInform extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { BrowserRuleSettingProps, BrowserRuleSettingActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(BrowserRuleSettingProps, compId, 'objId') : getSelectedObjectInComp(BrowserRuleSettingProps, compId);

    BrowserRuleSettingActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: BrowserRuleSettingDialog.TYPE_EDIT
    });
  };

  // .................................................

  render() {

    const { classes } = this.props;
    const { BrowserRuleSettingProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const contentStyle = (compType == 'VIEW') ? {paddingRight: 0, paddingLeft: 0, paddingTop: 40, paddingBottom: 0} : {};

    const selectedViewItem = BrowserRuleSettingProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = BrowserRuleSettingProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = BrowserRuleSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
        {(viewCompItem) && <CardContent style={contentStyle}>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                {(compType == 'VIEW') ? '상세내용' : '브라우져제어정책'}
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
                  <TableCell component="th" scope="row">{bull} Web Socket 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.get('webSocket')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Web Worker 사용</TableCell>
                  <TableCell numeric>{selectedViewItem.get('webWorker')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.get('trustSetupId')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 비신뢰사이트 설정정보</TableCell>
                  <TableCell colSpan={3} style={{fontSize:"17px"}}><pre>{selectedViewItem.get('untrustSetupId')}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} White List</TableCell>
                  <TableCell colSpan={3} numeric>{selectedViewItem.get('trustUrlList').map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          }
          </CardContent>
        }
      </Card>
      <BrowserRuleSettingDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleSettingProps: state.BrowserRuleSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleSettingActions: bindActionCreators(BrowserRuleSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(BrowserRuleSettingInform));

