import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { css } from 'glamor';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import ClientHostNameDialog from './ClientHostNameManageDialog';

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
      selectedItem: viewItem,
      dialogType: ClientHostNameDialog.TYPE_EDIT,
    });
  };

  // .................................................
  render() {
    const bull = <span className={bullet}>•</span>;
    const { ClientHostNameProps, compId } = this.props;
    const { viewItems } = ClientHostNameProps;

    let viewItem = null;
    if(viewItems) {
      viewItem = viewItems.find(function(element) {
        return element._COMPID_ == compId;
      });
    }

    return (

      <React.Fragment>
      <Card className={card}>
        {(viewItem) && <CardContent>

          <Grid container spacing={24}>
            <Grid item xs={6}>
              <Typography className={title} style={{backgroundColor:"lightBlue",color:"white",fontWeight:"bold"}}>
                Hosts설정
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
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} Host 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{viewItem.hosts}</pre></TableCell>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHostNameComp);


