import React, { Component } from "react";
import { Map, List as GRIMTList } from 'immutable';

import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";

import ClientListForSelectByGroup from 'views/Client/ClientListForSelectByGroup';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

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
import Checkbox from "@material-ui/core/Checkbox";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientSingleSelectDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
          selectedGroupId: 0
        };
      }

    handleGroupNodeCheck = (param) => {
        const { selectedGroup, onSelectGroup } = this.props;
        let newInfoList = [];
        if(param.isChecked) {
            // add
            newInfoList = selectedGroup.push(Map({name: param.name, value: param.value}));
        } else {
            // delete
            newInfoList = selectedGroup.filter(n => (n.get('value') != param.value));
        }
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleGroupNodeSelect = (param) => {
        this.setState({
            selectedGroupId: param.value
        });
    }

    handleCheckGroupForInherit = (event, item) => {
        const { selectedGroup, onSelectGroup } = this.props;
        const index = selectedGroup.findIndex(n => (n.get('value') === item));
        const newInfoList = selectedGroup.setIn([index, 'isCheck'], event.target.checked);
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleGroupDeleteItem = (param) => {
        const { selectedGroup, onSelectGroup } = this.props;
        // delete
        const newInfoList = selectedGroup.filter(n => (n.get('value') != param));
        onSelectGroup(GRIMTList(newInfoList));
    }

    handleClientCheck = (param) => {
        this.props.onSelectClient(param);
    }

    handleClientDeleteItem = (param) => {
        const { selectedClient, onSelectClient } = this.props;
        // delete
        const newInfoList = selectedClient.filter(n => (n.get('value') != param));
        onSelectClient(GRIMTList(newInfoList));
    }

    render() {
        const { classes, compId } = this.props;
        const { isSelectorOpen, onHandleClose, selectedGroup, isCheckMasterOnly, selectedClient } = this.props;
        const { t, i18n } = this.props;

        return (
            <Dialog open={isSelectorOpen} scroll="paper" fullWidth={true} maxWidth="md">
                <DialogTitle >{'단말선택'}</DialogTitle>
                <DialogContent>
                    <Card >
                        <CardContent >
                            <Grid container spacing={0}>
                                <Grid item xs={6} style={{padding:0,height:310,overflowY:'scroll',marginBottom:0,border:'1px solid lightgray'}}>
                                    <GRExtendedTreeList
                                        compId={compId}
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenClientGroupList'
                                        paramKeyName='grpId'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='1'
                                        hasSelectChild={false}
                                        hasSelectParent={false}
                                        isShowCheck={false}
                                        isCheckMasterOnly={isCheckMasterOnly}
                                        isEnableEdit={false}
                                        onCheckedNode={(param) => {this.handleGroupNodeCheck(param);}}
                                        onSelectNode={(param) => {this.handleGroupNodeSelect(param);}}
                                        checkedNodes={selectedGroup}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:310,overflowY:'scroll',marginBottom:0,border:'1px solid lightgray'}}>
                                    <ClientListForSelectByGroup 
                                        groupId={this.state.selectedGroupId}
                                        checkedClient={selectedClient}
                                        onSelectClient={this.handleClientCheck}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onHandleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default translate("translations")(withStyles(GRCommonStyle)(ClientSingleSelectDialog));
