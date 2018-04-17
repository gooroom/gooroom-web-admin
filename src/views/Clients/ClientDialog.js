import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from "material-ui/styles";
import { css } from 'glamor';

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Dialog, { DialogTitle, DialogActions } from "material-ui/Dialog";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";

import Button from "material-ui/Button";
import Search from "@material-ui/icons/Search";

//
//  ## Temporary ########## ########## ########## ########## ##########
//
import Avatar from "material-ui/Avatar";
import List, { ListItem, ListItemAvatar, ListItemText } from "material-ui/List";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "material-ui/Typography";


import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';



//
//  ## Style ########## ########## ########## ########## ##########
//

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ff4400',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
  },
});

const paperClass = css({
    textAlign: 'center',
    color: theme.palette.text.secondary,
}).toString();

const tableContainerClass = css({
  margin: "0px 30px !important",
  minHeight: 500,
  minWidth: 500,
}).toString();

const tableClass = css({
  minWidth: 500,
}).toString();

const tableLabelCellClass = css({
  height: "1em !important",
  padding: "5px !important",
}).toString();

const tableContentCellClass = css({
  height: "1em !important",
  padding: "5px !important",
  fontWeight: "bolder"
}).toString();


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tabValue: 0,
      clientRuleInfo: {},
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ 
      tabValue: 0 ,
      clientRuleInfo: {},
    });
    this.props.onClose(this.props.clientInfos);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  handleTabChange = (event, value) => {
    this.setState({ tabValue: value });
  };

  render() {
    const { onClose, clientInfos, ...other } = this.props;
    const { tabValue, clientRuleInfo } = this.state;

    let clientInfo = {};
    if (clientInfos && clientInfos.length > 0) {
      clientInfo = clientInfos[0];

      console.log("ClientDialog >>>>>>>>>>>>>>>>>> GET render tabValue: " + tabValue + ", clientRuleInfo: " + clientRuleInfo);

      if(tabValue === 1 && (Object.keys(clientRuleInfo).length === 0 && clientRuleInfo.constructor === Object)) {
        console.log("ClientDialog >>>>>>>############>>>>> GET render tabValue: " + tabValue);
        grRequestPromise("http://localhost:8080/gpms/readClientConfByGroupId", {
          clientGroupId: (clientInfo.clientGroupId) ? clientInfo.clientGroupId: ""
        }).then(res => {
            if(res.data && res.data.length > 0) {
              this.setState({
                clientRuleInfo: res.data[0]
              });
            }
        });
      }

      return (
        <Dialog
          disableBackdropClick={true}
          onClose={this.handleClose}
          aria-labelledby="client-dialog-title"
          {...other}
        >
          <DialogTitle id="client-dialog-title" >단말 정보</DialogTitle>

          <div className={tableContainerClass}>

          {tabValue === 0 && 
            <Table className={tableClass}>
              <TableBody >
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>단말아이디</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.clientId}</TableCell>
                  <TableCell className={tableLabelCellClass}>단말상태</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.clientStatus}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>단말이름</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.clientName}</TableCell>
                  <TableCell className={tableLabelCellClass}>단말그룹</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.clientGroupName}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>제품번호</TableCell>
                  <TableCell colSpan={3} className={tableContentCellClass}>{clientInfo.prodNo}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>단말아이피</TableCell>
                  <TableCell colSpan={3} className={tableContentCellClass}>{clientInfo.clientIp}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>등록일</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.regDate}</TableCell>
                  <TableCell className={tableLabelCellClass}>수정일</TableCell>
                  <TableCell className={tableContentCellClass}>{clientInfo.modDate}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
          {tabValue === 1 && 
            <Table className={tableClass}>
              <TableBody >
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>정책이름</TableCell>
                  <TableCell className={tableContentCellClass}>{clientRuleInfo.objId}</TableCell>
                  <TableCell className={tableLabelCellClass}>정책아이디</TableCell>
                  <TableCell className={tableContentCellClass}>{clientRuleInfo.objNm}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>정책설명</TableCell>
                  <TableCell colSpan={3} className={tableContentCellClass}>{clientRuleInfo.comment}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell className={tableLabelCellClass}>Agent Polling</TableCell>
                  <TableCell className={tableContentCellClass}>{clientRuleInfo.objNm}</TableCell>
                  <TableCell className={tableLabelCellClass}>운영체제보호</TableCell>
                  <TableCell className={tableContentCellClass}>{clientRuleInfo.objNm}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          }
          {tabValue === 2 && <div>Item Three</div>}
          </div>

          <AppBar position="static">
          <Tabs value={tabValue} onChange={this.handleTabChange}>
            <Tab label="기본정보" />
            <Tab label="정책정보" />
            <Tab label="기타" />
          </Tabs>
          </AppBar>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      );
      

    } else {
      // ERROR

      return (
        <Dialog
          disableBackdropClick={true}
          onClose={this.handleClose}
          {...other}
        >
          <DialogTitle id="simple-dialog-title">단말 정보</DialogTitle>
        </Dialog>
      );
    }


  }
}

export default ClientDialog;
