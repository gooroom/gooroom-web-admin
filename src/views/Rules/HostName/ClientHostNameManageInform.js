import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';

import * as ClientHostNameActions from 'modules/ClientHostNameModule';

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
class ClientHostNameInform extends Component {

  // .................................................

  render() {
    const { classes } = this.props;
    const { ClientHostNameProps, compId } = this.props;
    const { viewItems } = ClientHostNameProps;
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
      <div>
      {(ClientHostNameProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.comment}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{width:"170px"}}>{bull} Host 정보</TableCell>
                  <TableCell style={{fontSize:"17px"}}><pre>{selectedViewItem.hosts}</pre></TableCell>
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
  ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientHostNameInform));

export const createViewObject = (param) => {

  if(param) {

    let hosts = '';
  
    param.propList.forEach(function(e) {
      if(e.propNm == 'HOSTS') {
        hosts = e.propValue;
      }
    });
  
    return {
      objId: param.objId,
      objNm: param.objNm,
      comment: param.comment,
      modDate: param.modDate,
      hosts: hosts
    };
  
  } else {
    return param;
  }

};
