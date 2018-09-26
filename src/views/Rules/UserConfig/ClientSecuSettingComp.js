import React, { Component } from "react";
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientSecuSettingActions from 'modules/ClientSecuSettingModule';

import ClientSecuSettingDialog from './ClientSecuSettingDialog';
import { generateConfigObject } from './ClientSecuSettingInform';
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
class ClientSecuSettingComp extends Component {

  handleEditBtnClick = (objId, compType) => {
    const { ClientSecuSettingProps, ClientSecuSettingActions, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(ClientSecuSettingProps, compId, 'objId') : getSelectedObjectInComp(ClientSecuSettingProps, compId);

    ClientSecuSettingActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: ClientSecuSettingDialog.TYPE_EDIT
    });
  };

  render() {

    const { classes } = this.props;
    const { ClientSecuSettingProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const contentStyle = (compType == 'VIEW') ? {paddingRight: 0, paddingLeft: 0, paddingTop: 40, paddingBottom: 0} : {};

    const selectedViewItem = ClientSecuSettingProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientSecuSettingProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = ClientSecuSettingProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
      <ClientSecuSettingDialog compId={compId} />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientSecuSettingProps: state.ClientSecuSettingModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientSecuSettingActions: bindActionCreators(ClientSecuSettingActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientSecuSettingComp));

