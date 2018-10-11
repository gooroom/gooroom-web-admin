import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientListForSelect from 'views/Client/ClientListForSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientSelectDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            stateData: Map({
                selectedGroupId: '',
                selectedGroupNm: '',
                selectedClient: List([])
            })
        };
    }

    componentDidMount() {
        //console.log('props :::::::::: ', this.props);
    }

    handleSelectDept = (node) => {
        this.setState(({stateData}) => ({
            stateData: stateData.set('selectedGroupId', node.key).set('selectedGroupNm', node.title)
        }));
    }

    handleSelectClient = (newSelectedIds) => {
        this.setState(({stateData}) => ({
            stateData: stateData.set('selectedClient', List(newSelectedIds))
        }));
    }

    handleAddButton = (event) => {
        if(this.props.onSaveHandle) {
            this.props.onSaveHandle(this.state.stateData.get('selectedClient'));
        }
    }
    
    render() {
        const { classes } = this.props;
        const { isOpen, UserProps } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>단말 선택</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={8}>
                            {/* <Grid item xs={12} sm={12} lg={4}>
                                <Card className={classNames(classes.deptTreeCard)}>
                                    <GrTreeList
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenDeptList'
                                        paramKeyName='groupId'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='2'
                                        onSelectNode={this.handleSelectDept}
                                    />
                                </Card>
                            </Grid> */}
                            <Grid item xs={12} sm={12} lg={12}>
                                <Card className={classes.deptUserCard}>
                                    <CardContent>
                                        <ClientListForSelect name='ClientListForSelect' 
                                            groupId={this.state.stateData.get('selectedGroupId')} 
                                            onSelectClient={this.handleSelectClient}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAddButton} variant='contained' color="secondary">추가</Button>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">닫기</Button>
                    </DialogActions>
                    <GrConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

export default withStyles(GrCommonStyle)(ClientSelectDialog);
