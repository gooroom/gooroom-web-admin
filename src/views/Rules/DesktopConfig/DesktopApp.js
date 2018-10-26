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

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopApp extends Component {

  // .................................................
  render() {

    const { classes } = this.props;
    const { appObj, themeId } = this.props;

    let iconUrl = '';
    if(appObj && appObj.get('iconGubun')) {
      console.log('>>>>> ', appObj.toJS());
      iconUrl = (appObj.get('iconGubun') == 'library') ? 'https://gpms.gooroom.kr/gpms/images/gr_icons/' + themeId + '_' + appObj.get('iconId') + '.svg' : appObj.get('iconUrl');
    }
    
    return (
      <Paper style={{width:160,height:200}} elevation={5}>
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
                
                <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:18,minHeight:18}}
                    onClick={() => this.props.handleEditClick(viewItem, compType)}
                ><SettingsApplicationsIcon style={{fontSize:18}} /></Button>

                <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:18,minHeight:18,marginLeft:3}}
                    onClick={() => this.props.handleDeleteClick(viewItem, compType)}
                ><DeleteIcon style={{fontSize:18}} /></Button>

              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2} style={{padding:'13 0 13 0',textAlign:'center'}}>
              <img src={iconUrl} width={50}/>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} style={{padding:'13 0 13 0',textAlign:'center'}}>{appObj.get('appNm')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell numeric>2018-10-25</TableCell>
              <TableCell numeric>admin</TableCell>
            </TableRow>

            
          </TableBody>
        </Table>
      }

      </Paper>
    );
  }
}


export default withStyles(GRCommonStyle)(DesktopApp);

