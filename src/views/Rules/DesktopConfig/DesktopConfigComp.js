import React, { Component } from 'react';
import { fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { generateConfigObject } from './ClientDesktopConfigInform';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId } from 'components/GrUtils/GrTableListUtils';

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
    const { ClientDesktopConfigProps, compId, compType } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const selectedViewItem = ClientDesktopConfigProps.getIn(['viewItems', compId, 'selectedViewItem']);
    const listAllData = ClientDesktopConfigProps.getIn(['viewItems', compId, 'listAllData']);
    const selectedOptionItemId = ClientDesktopConfigProps.getIn(['viewItems', compId, 'selectedOptionItemId']);
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
        <CardContent style={{padding: 10}}>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.compTitle}>
                {(compType == 'VIEW') ? '상세내용' : '데스크톱환경'}
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
          <Typography variant="h5" component="h2">
            name
          </Typography>
          <Typography color="textSecondary">
            comment
          </Typography>
          <Divider />
          {(viewCompItem && viewCompItem.get('objId') != '') &&
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell >{bull} 데스크톱환경 정보</TableCell>
                </TableRow>
                <TableRow>
                </TableRow>

              </TableBody>
            </Table>
          }
          </CardContent>
      </Card>
      </React.Fragment>
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


