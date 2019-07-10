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
class TreeAndListMultiSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
          selectedDeptCd: 0
        };
      }

    handleTreeNodeCheck = (param) => {
        const { selectedItem, onSelectItem } = this.props;
        this.setState({
            selectedDeptCd: param.value
        });
        let newInfoList = [];
        if(param.isChecked) {
            // add
            newInfoList = selectedItem.push(Map({name: param.name, value: param.value}));
        } else {
            // delete
            newInfoList = selectedItem.filter(n => (n.get('value') != param.value));
        }
        onSelectItem(GRIMTList(newInfoList));
    };

    handleSelectUser = (param) => {

    }

    handleDeleteItem = (param) => {
        const { selectedItem, onSelectItem } = this.props;

        // delete
        const newInfoList = selectedItem.filter(n => (n.get('value') != param));
        onSelectItem(GRIMTList(newInfoList));
    }

    render() {
        const { classes, compId } = this.props;
        const { title, selectedItem, isCheckMasterOnly, treeUrl, paramKeyName } = this.props;
        const { t, i18n } = this.props;

        return (

                    <Card >
                        <CardHeader style={{padding:3,backgroundColor:'#a1b1b9'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={title}></CardHeader>
                        <CardContent >

                            <Grid container spacing={0}>
                                <Grid item xs={6} style={{padding:0,height:'290px',overflowY:'scroll',marginBottom:10}}>
                                    <GRExtendedTreeList
                                        compId={compId}
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url={treeUrl}
                                        paramKeyName={paramKeyName}
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='1'
                                        hasSelectChild={false}
                                        hasSelectParent={false}
                                        isShowCheck={true}
                                        isCheckMasterOnly={isCheckMasterOnly}
                                        isEnableEdit={false}
                                        onCheckedNode={(param) => {this.handleTreeNodeCheck(param);}}
                                        checkedNodes={selectedItem}
                                        onRef={ref => (this.grExtendedTreeListForDept = ref)}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{border:'1px solid red'}}>
                                    <UserListForSelectByDept name='UserListForSelectByDept' 
                                        deptCd={this.state.selectedDeptCd} 
                                        onSelectUser={this.handleSelectUser}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:100,overflowY:'scroll',marginBottom:10}}>
                                    <List >
                                    {selectedItem && selectedItem.map((n) => (
                                        <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                            <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                            <ListItemText primary={n.get('name')} />
                                            <ListItemSecondaryAction>
                                                <Button size="small" color="secondary" className={classes.buttonInTableRow} 
                                                    onClick={event => this.handleDeleteItem(n.get('value'))}>
                                                    <DeleteIcon />
                                                </Button>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                                    </List>
                                        
                                </Grid>
                                <Grid item xs={6}>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(TreeAndListMultiSelector));

