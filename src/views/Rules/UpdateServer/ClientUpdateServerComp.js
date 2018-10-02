import React, { Component } from 'react';
import { fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import ClientUpdateServerDialog from './ClientUpdateServerManageDialog';
import { generateConfigObject } from './ClientUpdateServerManageInform';
import { getSelectedObjectInCompAndId, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  handleEditBtnClick = (param, compType) => {
    const { ClientUpdateServerActions, ClientUpdateServerProps, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(ClientUpdateServerProps, compId, 'objId') : getSelectedObjectInComp(ClientUpdateServerProps, compId);

    ClientUpdateServerActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: ClientUpdateServerDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientUpdateServerProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientUpdateServerProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
                {(compType == 'VIEW') ? '상세내용' : '업데이트서버설정'}
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
                  <TableCell component="th" scope="row" >{bull} 주 OS 정보</TableCell>
                  <TableCell><pre>{viewCompItem.get('mainos')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} 기반 OS 정보</TableCell>
                  <TableCell><pre>{viewCompItem.get('extos')}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" >{bull} gooroom.pref</TableCell>
                  <TableCell><pre>{viewCompItem.get('priorities')}</pre></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
      }
      </Card>
      <ClientUpdateServerDialog compId={compId} />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientUpdateServerProps: state.ClientUpdateServerModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientUpdateServerComp));


