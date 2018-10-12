import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';

import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerInform extends Component {

  // .................................................

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { ClientUpdateServerProps, compId } = this.props;
    const informOpen = ClientUpdateServerProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = generateConfigObject(ClientUpdateServerProps.getIn(['viewItems', compId, 'selectedViewItem']));

    return (
      <div >
      {(informOpen && selectedViewItem) &&
        <Card >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('objNm') : ''}
            subheader={selectedViewItem.get('objId') + ', ' + formatDateToSimple(selectedViewItem.get('modDate'), 'YYYY-MM-DD')}
          />
          <CardContent >
            <Typography component="pre">
              "{selectedViewItem.get('comment')}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} 주 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.get('mainos')}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} 기반 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.get('extos')}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} gooroom.pref</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.get('priorities')}</pre></TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </CardContent>
        </Card>
      }
      </div>
    );

  }
}


const mapStateToProps = (state) => ({
  ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientUpdateServerInform));

export const generateConfigObject = (param) => {
  
  if(param) {

    let mainos = '';
    let extos = '';
    let priorities = '';

    param.get('propList').forEach(function(e) {
      const ename = e.get('propNm');
      const evalue = e.get('propValue');
      if(ename == 'MAINOS') {
        mainos = evalue;
      } else if(ename == 'EXTOS') {
        extos = evalue;
      } else if(ename == 'PRIORITIES') {
        priorities = evalue;
      }
    });

    return Map({
      objId: param.get('objId'),
      objNm: param.get('objNm'),
      comment: param.get('comment'),
      modDate: param.get('modDate'),
      mainos: mainos,
      extos: extos,
      priorities: priorities
    });
    
  } else {
    return param;
  }

};

