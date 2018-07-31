import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientHostNameDialog from './ClientHostNameManageDialog';
import { createViewObject } from './ClientHostNameManageInform';

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
      loading: true,
    };
  }

  handleEditBtnClick = (param) => {
    const { ClientHostNameActions, ClientHostNameProps, compId } = this.props;
    const viewItem = ClientHostNameProps.viewItems.find(function(element) {
      return element._COMPID_ == compId;
    });

    ClientHostNameActions.showDialog({
      compId: compId,
      selectedItem: createViewObject(viewItem.selectedItem),
      dialogType: ClientHostNameDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientHostNameProps, compId } = this.props;
    const { viewItems } = ClientHostNameProps;
    const bull = <span className={classes.bullet}>•</span>;
    
    let viewCompItem = null;
    if(viewItems) {
      const viewItem = viewItems.find((element) => {
        return element._COMPID_ === compId;
      });
      if(viewItem) {
        viewCompItem = createViewObject(viewItem.selectedItem);
      }
    }

    return (

      <React.Fragment>
      <Card >
        {(viewCompItem) && <CardContent>

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography style={{backgroundColor:"lightBlue",color:"white",fontWeight:"bold"}}>
                Hosts설정
              </Typography>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
              <Button
                variant="outlined" color="primary"
                onClick={() => this.handleEditBtnClick(viewCompItem.objId)}
              ><SettingsApplicationsIcon />수정</Button>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewCompItem.objNm}
          </Typography>
          <Typography color="textSecondary">
            {(viewCompItem.comment != '') ? '"' + viewCompItem.comment + '"' : ''}
          </Typography>
          <Divider />
          {(viewCompItem && viewCompItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} Host 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewCompItem.hosts}</pre></TableCell>
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
  ClientGroupProps: state.ClientGroupModule,
  ClientHostNameProps: state.ClientHostNameModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameComp));


