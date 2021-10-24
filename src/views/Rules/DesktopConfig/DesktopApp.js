import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopApp extends Component {

  handleEditClick = (appId) => {
    if(this.props.onEditClick) {
      this.props.onEditClick(appId);
    }
  }

  handleAddClick = (appObj) => {
    if(this.props.onAddClick) {
      this.props.onAddClick(appObj);
    }
  }

  handleDeleteClick = (appId) => {
    if(this.props.onDeleteClick) {
      this.props.onDeleteClick(appId);
    }
  }

  // .................................................
  render() {

    const { classes } = this.props;
    const { isSelected, appObj, hasAction, themeId } = this.props;

    let iconUrl = '';
    if(appObj && appObj.get('iconGubun')) {
      iconUrl = (appObj.get('iconGubun') == 'library') ? '/gpms/images/gr_icons/' + themeId + '_' + appObj.get('iconId') + '.svg' : appObj.get('iconUrl');
    }
    const isHaveAction = (hasAction) ? hasAction : false;

    return (
      <Paper style={{width:120,height:174}} elevation={5}>
      { (appObj) &&
        <Table style={{width:'100%'}}>

          <TableHead >
            <TableRow style={{height:24,backgroundColor:'#cdcdcd'}}>
              
              <TableCell style={{padding:'0 0 0 3'}}>
                <Typography variant="caption" style={{fontSize:10,fontWeight:'bold'}}>
                  {appObj.get('appGubun')}
                </Typography>
              </TableCell>

              <TableCell style={{padding:0,textAlign:'right'}}>
                {(isHaveAction && this.props.onEditClick) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:18,minHeight:18}}
                    onClick={() => this.handleEditClick(appObj)}
                  ><SettingsApplicationsIcon style={{fontSize:18}} /></Button>
                }
                {(isHaveAction && this.props.onDeleteClick && this.props.isEnableDelete) && 
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:18,minHeight:18,marginLeft:3}}
                    onClick={() => this.handleDeleteClick(appObj.get('appId'))}
                  ><DeleteIcon style={{fontSize:18}} /></Button>
                }
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} style={{padding:'6 0 6 0',height:63,textAlign:'center'}}>
               <img src={iconUrl} height={50}/>
              </TableCell>
            </TableRow>
            <TableRow style={{height:62}}>
              <TableCell colSpan={2} style={{padding:'6 0 6 0',textAlign:'center'}}>{appObj.get('appNm')}</TableCell>
            </TableRow>

            <TableRow style={{height:24,backgroundColor:'#dedede'}}>
              <TableCell></TableCell>
              <TableCell style={{padding:0,textAlign:'right'}}>
              { (!isSelected && this.props.type == 'main') &&
                <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:18,minHeight:18}}
                    onClick={() => this.handleAddClick(appObj)}
                ><AddIcon style={{fontSize:18}} /></Button>
              }
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      }

      </Paper>
    );
  }
}


export default withStyles(GRCommonStyle)(DesktopApp);

