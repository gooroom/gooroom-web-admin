import React, { Component } from "react";
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as MediaRuleActions from 'modules/MediaRuleModule';

import MediaRuleDialog from './MediaRuleDialog';
import { generateConfigObject } from './MediaRuleInform';
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
class MediaRuleComp extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { MediaRuleProps, MediaRuleActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(MediaRuleProps, compId, 'objId') : getSelectedObjectInComp(MediaRuleProps, compId);

    MediaRuleActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: MediaRuleDialog.TYPE_EDIT
    });
  };

  // .................................................

  render() {

    const { classes } = this.props;
    const { MediaRuleProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = MediaRuleProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = MediaRuleProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
    const isDefault = MediaRuleProps.getIn(['viewItems', compId, 'isDefault']);

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
                <Typography className={(isDefault) ? classes.compTitleForBasic : classes.compTitle}>
                  {(compType == 'VIEW') ? '상세내용' : '매체제어정책'} {(isDefault) ? '*no' : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justify="flex-end">
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.handleEditBtnClick(viewCompItem.get('objId'), compType)}
                  ><SettingsApplicationsIcon /></Button>
                </Grid>
              </Grid>
            </Grid>

            <Typography variant="h5" component="h2">
              {viewCompItem.get('objNm')}
            </Typography>
            <Typography color="textSecondary">
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(MediaRuleComp));
