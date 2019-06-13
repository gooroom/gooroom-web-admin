import React, { Component } from "react";

import GRExtendedTreeList from "components/GRTree/GRExtendedTreeList";
import ClientListForSelectByGroup from 'views/Client/ClientListForSelectByGroup';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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

    handleGroupNodeSelect = (param) => {
        this.setState({
            selectedGroupId: param.value
        });
    }

    handleClientCheck = (param) => {
        if(param && param.get('clientId') !== undefined) {
            this.props.onSelectClient(param);
            this.props.onHandleClose(); 
        }
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
                                        onSelectNode={(param) => {this.handleGroupNodeSelect(param);}}
                                        checkedNodes={selectedGroup}
                                    />
                                </Grid>
                                <Grid item xs={6} style={{padding:0,height:310,overflowY:'scroll',marginBottom:0,border:'1px solid lightgray'}}>
                                    <ClientListForSelectByGroup 
                                        groupId={this.state.selectedGroupId}
                                        isSingle={true}
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
