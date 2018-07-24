import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from 'glamor';

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


//
//  ## Style ########## ########## ########## ########## ########## 
//
const componentClass = css({
  marginTop: "20px !important"
}).toString();

const contentClass = css({
  paddingTop: "0px !important"
}).toString();

const cardContainerClass = css({
  padding: "10px !important"
}).toString();


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


//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientHostNameInform extends Component {

  // .................................................

  render() {

    const bull = <span className={bullet}>•</span>;
    const { ClientHostNameProps, compId } = this.props;
    const { viewItems } = ClientHostNameProps;

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
      <div className={componentClass}>
      {(ClientHostNameProps.informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.objNm : ''}
            subheader={selectedViewItem.objId + ', ' + formatDateToSimple(selectedViewItem.modDate, 'YYYY-MM-DD')}
          />
          <CardContent className={contentClass}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientHostNameInform);

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
