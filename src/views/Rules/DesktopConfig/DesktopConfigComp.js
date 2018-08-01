import React, { Component } from 'react';
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

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
class DesktopConfigComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // .................................................
  render() {
    const { classes } = this.props;
    const { ClientDesktopConfigProps, compId } = this.props;
    const bull = <span className={classes.bullet}>•</span>;
    const { [compId + '__editingItem'] : viewItem } = ClientDesktopConfigProps;

    return (

      <Card elevation={0}>
        {(viewItem) && <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                데스크톱환경
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justify="flex-end">
                <Button size="small"
                  variant="outlined" color="primary"
                  onClick={() => this.handleEditBtnClick(viewCompItem.objId)}
                ><SettingsApplicationsIcon />수정</Button>
              </Grid>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewItem.confNm}
          </Typography>
          <Typography color="textSecondary">
            {(viewItem.themeNm && viewItem.themeNm != '') ? '"' + viewItem.themeNm + '"' : ''}
          </Typography>
          <Divider />
          {(viewItem && viewItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell >{bull} 데스크톱환경 정보</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{fontSize:"17px"}}>
                    <pre style={{width:"64%", height:"135px", overflow:"auto"}}>
                    {viewItem.confInfo}
                    </pre>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
      }
      </Card>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule,
  ClientDesktopConfigProps: state.ClientDesktopConfigModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(DesktopConfigComp));


