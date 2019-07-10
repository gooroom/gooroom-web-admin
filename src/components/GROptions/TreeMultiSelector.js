import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";

import Button from "@material-ui/core/Button";
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

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
class TreeMultiSelector extends Component {

    handleTreeNodeCheck = (param) => {
        const { selectedItem, onSelectItem } = this.props;

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

    handleDeleteItem = (param) => {
        const { selectedItem, onSelectItem } = this.props;

        // delete
        const newInfoList = selectedItem.filter(n => (n.get('value') != param));
        onSelectItem(GRIMTList(newInfoList));
    }

    render() {
        const { classes, compId } = this.props;
        const { title, selectedItem, isCheckMasterOnly, url, paramKeyName } = this.props;

        const { t, i18n } = this.props;

        return (
            <Card square={true}>
                <CardHeader style={{padding:3,backgroundColor:'#d0d2d3'}} titleTypographyProps={{variant:'body2', style:{fontWeight:'bold'}}} title={title}></CardHeader>
                <CardContent style={{padding:0,height:200,overflowY:'auto'}}>
                    <GRExtendedTreeList
                        compId={compId}
                        useFolderIcons={true}
                        listHeight='24px'
                        url={url}
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
                </CardContent>
                <Divider style={{margin:5}} />
                <CardContent style={{padding:0,height:100,overflowY:'scroll',marginBottom:10}}>
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
                </CardContent>
            </Card>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(TreeMultiSelector));

