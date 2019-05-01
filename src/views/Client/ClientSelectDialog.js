import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import * as ClientGroupActions from 'modules/ClientGroupModule';
import GRConfirm from 'components/GRComponents/GRConfirm';

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
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


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
        const { isOpen, compId } = this.props;
        const { t, i18n } = this.props;

        if(!isOpen) {
            return (<React.Fragment></React.Fragment>);
        }

        let checkedGrpId = getDataObjectVariableInComp(this.props.ClientGroupProps, compId, 'checkedGrpId');
        let selectedGrpNm = '';
        if(checkedGrpId && checkedGrpId.size > 0) {
            const selectedGrpId = checkedGrpId.get(0);
            selectedGrpNm = this.props.ClientGroupProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(e => (e.get('key') === selectedGrpId)).get('title');
        }

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("dtSelectClient")} ({selectedGrpNm})</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={8}>
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
                        <Button onClick={this.handleAddButton} variant='contained' color="secondary">{t("btnAdd")}</Button>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">{t("btnClose")}</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch)
});


export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientSelectDialog)));