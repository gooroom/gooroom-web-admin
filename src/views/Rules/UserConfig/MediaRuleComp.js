import React, { Component } from "react";
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { generateConfigObject } from './MediaRuleInform';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getRoleTitleClassName } from 'components/GRUtils/GRTableListUtils';

import * as MediaRuleActions from 'modules/MediaRuleModule';
import MediaRuleDialog from './MediaRuleDialog';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
class MediaRuleComp extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { MediaRuleProps, MediaRuleActions, compId, targetType } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(MediaRuleProps, compId, targetType);

    MediaRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };

  handleInheritBtnClick = (objId, compType) => {
    const { MediaRuleProps, MediaRuleActions, compId, targetType } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId', targetType) : getSelectedObjectInComp(MediaRuleProps, compId, targetType);

    MediaRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_INHERIT
    });
  };

  // .................................................
  render() {

    const { classes } = this.props;
    const { MediaRuleProps, compId, compType, targetType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedObj = (targetType && targetType != '') ? MediaRuleProps.getIn(['viewItems', compId, targetType]) : MediaRuleProps.getIn(['viewItems', compId]);
    const selectedViewItem = (selectedObj) ? selectedObj.get('selectedViewItem') : null;
    const listAllData = (selectedObj) ? selectedObj.get('listAllData') : null;

    const selectedOptionItemId = (selectedObj) ? selectedObj.get('selectedOptionItemId') : null;
    const isDefault = (selectedObj) ? selectedObj.get('isDefault') : null;
    const isDeptRole = (selectedObj) ? selectedObj.get('isDeptRole') : null;

    const titleClassName = getRoleTitleClassName(this.props.targetType, isDefault, isDeptRole);

    console.log('compType :::::::::: ', compType);

    const viewCompItem = (compType != 'VIEW') ? generateConfigObject(selectedViewItem) : 
      (() => {
        console.log('@#$%@#$%#$%#$%#%#$#$#$#$%#$%#$@#$#$%#%#@%#$%#$#$%#$%#$%#$%#$%#%#$%#$%#$%#$%#$%@#%');
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
              <Typography className={classes.compTitleForEmpty}>매체제어정책</Typography>
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
                  {(compType == 'VIEW') ? '상세내용' : '매체제어정책'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-end">
                  {(this.props.inherit && !isDefault) && 
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
                  <TableCell component="th" scope="row">{bull} USB메모리</TableCell>
                  <TableCell numeric>{viewCompItem.get('usbMemory')}</TableCell>
                  <TableCell component="th" scope="row">{bull} CD/DVD</TableCell>
                  <TableCell numeric>{viewCompItem.get('cdAndDvd')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 프린터</TableCell>
                  <TableCell numeric>{viewCompItem.get('printer')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 화면캡쳐</TableCell>
                  <TableCell numeric>{viewCompItem.get('screenCapture')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 사운드(소리,마이크)</TableCell>
                  <TableCell numeric>{viewCompItem.get('sound')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 카메라</TableCell>
                  <TableCell numeric>{viewCompItem.get('camera')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} USB키보드</TableCell>
                  <TableCell numeric>{viewCompItem.get('keyboard')}</TableCell>
                  <TableCell component="th" scope="row">{bull} USB마우스</TableCell>
                  <TableCell numeric>{viewCompItem.get('mouse')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 무선랜</TableCell>
                  <TableCell numeric>{viewCompItem.get('wireless')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 블루투스</TableCell>
                  <TableCell numeric>{viewCompItem.get('bluetoothState')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  <TableCell numeric></TableCell>
                  <TableCell component="th" scope="row">{bull} 맥주소(블루투스)</TableCell>
                  <TableCell numeric>{viewCompItem.get('macAddress').map(function(prop, index) {
                    return <span key={index}>{prop}<br/></span>;
                  })}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
            </CardContent>
          </Card>
        }
      <MediaRuleDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  MediaRuleProps: state.MediaRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(MediaRuleComp));
