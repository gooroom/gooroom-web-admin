import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientUpdateServerDialog from './ClientUpdateServerManageDialog';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Checkbox from "@material-ui/core/Checkbox";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';


//
//  ## Theme override ########## ########## ########## ########## ########## 
//

//
//  ## Style ########## ########## ########## ########## ########## 
//

const title = css({
  marginBottom: 16,
  fontSize: 14,
}).toString();

const card = css({
  minWidth: 275,
}).toString();

const bullet = css({
  display: 'inline-block',
  margin: '0 2px',
  transform: 'scale(0.8)',
}).toString();

const pos = css({
  marginBottom: 12,
}).toString();

const grNarrowButton = css({
  paddingTop: '2px !important',
  paddingBottom: '2px !important'
}).toString();

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  handleEditBtnClick = (param) => {

    const { ClientUpdateServerActions, ClientUpdateServerProps, compId } = this.props;
    const { [compId + '__selectedItem'] : viewItem } = ClientUpdateServerProps;

    ClientUpdateServerActions.showDialog({
      compId: compId,
      selectedItem: viewItem,
      dialogType: ClientUpdateServerDialog.TYPE_EDIT,
    });

  };

  // .................................................
  render() {

    const { ClientUpdateServerProps, compId } = this.props;
    const bull = <span className={bullet}>•</span>;
    const { [compId + '__selectedItem'] : viewItem } = ClientUpdateServerProps;

    return (
      <React.Fragment>
      <Card className={card}>
        {(viewItem) && <CardContent>

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography className={title} style={{backgroundColor:"lightBlue",color:"white",fontWeight:"bold"}}>
                업데이트서버설정
              </Typography>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
              <Button
                className={grNarrowButton}
                variant="outlined" color="primary"
                onClick={() => this.handleEditBtnClick(viewItem.objId)}
              ><SettingsApplicationsIcon />수정</Button>
            </Grid>
          </Grid>
          <Typography variant="headline" component="h2">
            {viewItem.objNm}
          </Typography>
          <Typography className={pos} color="textSecondary">
            {(viewItem.comment != '') ? '"' + viewItem.comment + '"' : ''}
          </Typography>
          <Divider />
          {(viewItem && viewItem.objId != '') &&
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 주 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.mainos}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} 기반 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.extos}</pre></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} gooroom.pref</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.priorities}</pre></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
        </CardContent>
      }
      </Card>
      <ClientUpdateServerDialog />
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule
});


const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientUpdateServerComp);


