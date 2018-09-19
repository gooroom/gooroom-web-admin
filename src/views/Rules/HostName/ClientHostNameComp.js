import React, { Component } from 'react';
import { fromJS } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientHostNameDialog from './ClientHostNameManageDialog';
import { generateConfigObject } from './ClientHostNameManageInform';
import { getDataObjectInComp, getSelectedObjectInComp } from 'components/GrUtils/GrTableListUtils';

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
class ClientHostNameComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  handleEditBtnClick = (param) => {
    const { ClientHostNameActions, ClientHostNameProps, compId } = this.props;
    const selectedViewItem = (compType == 'VIEW') ? getSelectedObjectInCompAndId(ClientHostNameProps, compId) : getSelectedObjectInComp(ClientHostNameProps, compId);

    ClientHostNameActions.showDialog({
      selectedViewItem: generateConfigObject(selectedViewItem),
      dialogType: ClientHostNameDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientHostNameProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const contentStyle = (compType == 'VIEW') ? {paddingRight: 0, paddingLeft: 0, paddingTop: 40, paddingBottom: 0} : {};

    const selectedViewItem = ClientHostNameProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientHostNameProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = ClientHostNameProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
          {(compType != 'VIEW222222222222222222') && 
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                Hosts설정
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
          }
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
                  <TableCell component="th" scope="row">{bull} Host 정보</TableCell>
                  <TableCell><pre>{viewCompItem.get('hosts')}</pre></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
      }
      </Card>
      <ClientHostNameDialog />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientHostNameProps: state.ClientHostNameModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameComp));


