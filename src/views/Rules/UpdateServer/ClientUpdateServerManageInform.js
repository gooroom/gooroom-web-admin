import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

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
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientUpdateServerInform extends Component {

  // .................................................

  render() {
    const { classes } = this.props;
    const { ClientUpdateServerProps, compId } = this.props;
    const { viewItems } = ClientUpdateServerProps;
    const bull = <span className={classes.bullet}>•</span>;

    let selectedViewItem = null;
    if(viewItems) {
      const viewItem = viewItems.find(function(element) {
        return element._COMPID_ == compId;
      });
      if(viewItem) {
        selectedViewItem = createViewObject(viewItem.selectedItem);
      }
    }    

    return (
      <div >
      {(ClientUpdateServerProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent >
            <Typography component="pre">
              "{selectedViewItem.comment}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} 주 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.mainos}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} 기반 OS 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.extos}</pre></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"190px"}}>{bull} gooroom.pref</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.priorities}</pre></TableCell>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientUpdateServerInform));

export const createViewObject = (param) => {
  
  if(param) {

    let mainos = '';
    let extos = '';
    let priorities = '';
    
    param.propList.forEach(function(e) {
      if(e.propNm == 'MAINOS') {
        mainos = e.propValue;
      } else if(e.propNm == 'EXTOS') {
        extos = e.propValue;
      } else if(e.propNm == 'PRIORITIES') {
        priorities = e.propValue;
      }
    });

    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      mainos: mainos,
      extos: extos,
      priorities: priorities
    };
    
  } else {
    return param;
  }

};

