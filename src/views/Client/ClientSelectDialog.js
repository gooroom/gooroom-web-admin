import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

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
        const { isOpen, UserProps, groupName } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("dtSelectClient")} ({groupName})</DialogTitle>
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

export default translate("translations")(withStyles(GRCommonStyle)(ClientSelectDialog));
