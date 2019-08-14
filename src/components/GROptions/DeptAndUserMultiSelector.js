import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";

import UserListForSelectByDept from 'views/User/UserListForSelectByDept';

import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from '@material-ui/icons/Delete';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class DeptAndUserMultiSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
          selectedDeptCd: 0
        };
      }

    handleDeptNodeCheck = (param) => {
        const { selectedDept, onSelectDept } = this.props;
        let newInfoList = [];
        if(param.isChecked) {
            // add
            newInfoList = selectedDept.push(Map({name: param.name, value: param.value}));
        } else {
            // delete
            newInfoList = selectedDept.filter(n => (n.get('value') != param.value));
        }
        onSelectDept(GRIMTList(newInfoList));
    }

    handleDeptNodeSelect = (param) => {
        this.setState({
            selectedDeptCd: param.value
        });
    }

    handleDeptDeleteItem = (param) => {
        const { selectedDept, onSelectDept } = this.props;
        // delete
        const newInfoList = selectedDept.filter(n => (n.get('value') != param));
        onSelectDept(GRIMTList(newInfoList));
    }

    handleUserCheck = (isChecked, param) => {
        const { selectedUser, onSelectUser } = this.props;
        let newInfoList = [];
        if(isChecked) {
            // add
            newInfoList = selectedUser.push(Map({name: param.userNm, value: param.userId}));
        } else {
            // delete
            newInfoList = selectedUser.filter(n => (n.get('value') != param.userId));
        }
        onSelectUser(GRIMTList(newInfoList));
    }

    handleUserDeleteItem = (param) => {
        const { selectedUser, onSelectUser } = this.props;
        // delete
        const newInfoList = selectedUser.filter(n => (n.get('value') != param));
        onSelectUser(GRIMTList(newInfoList));
    }

    render() {
        const { classes, compId } = this.props;
        const { title, selectedDept, isCheckMasterOnly, selectedUser } = this.props;
        const { t, i18n } = this.props;

        return (

                    <Card >
                        {title && <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={title}></CardHeader>}
                        <CardContent >

                            <Grid container spacing={0}>
                                <Grid item xs={6} style={{padding:0,height:200,overflowY:'scroll',marginBottom:0,border:'1px solid lightgray'}}>
                                    <GRExtendedTreeList
                                        compId={compId}
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenDeptList'
                                        paramKeyName='deptCd'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='1'
                                        hasSelectChild={false}
                                        hasSelectParent={false}
                                        isShowCheck={true}
                                        isCheckMasterOnly={isCheckMasterOnly}
                                        isEnableEdit={false}
                                        onCheckedNode={(param) => {this.handleDeptNodeCheck(param);}}
                                        onSelectNode={(param) => {this.handleDeptNodeSelect(param);}}
                                        checkedNodes={selectedDept}
                                        onRef={ref => (this.grExtendedTreeListForDept = ref)}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:200,marginBottom:0,border:'1px solid lightgray'}}>
                                    <Typography variant="subtitle2">선택된 항목</Typography>
                                    <div style={{padding:0,overflowY:'auto'}}>
                                        <List >
                                        {selectedDept && selectedDept.map((n) => (
                                            <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                                <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                                <ListItemText primary={n.get('name')} />
                                                <ListItemSecondaryAction>
                                                    <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                        onClick={event => this.handleDeptDeleteItem(n.get('value'))}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                        </List>
                                    </div>
                                </Grid>
                                <Grid item xs={6} style={{paddingTop:10,height:310,overflowY:'scroll',marginBottom:10,border:'1px solid lightgray'}}>
                                    <UserListForSelectByDept 
                                        deptCd={this.state.selectedDeptCd}
                                        checkedUser={selectedUser} 
                                        onSelectUser={this.handleUserCheck}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:310,marginBottom:0,border:'1px solid lightgray'}}>
                                    <Typography variant="subtitle2">선택된 항목</Typography>
                                    <div style={{padding:0,overflowY:'auto'}}>
                                    <List >
                                        {selectedUser && selectedUser.map((n) => (
                                            <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                                <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                                <ListItemText primary={n.get('name')} />
                                                <ListItemSecondaryAction>
                                                    <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                        onClick={event => this.handleUserDeleteItem(n.get('value'))}>
                                                        <DeleteIcon />
                                                    </Button>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                    </div>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(DeptAndUserMultiSelector));
