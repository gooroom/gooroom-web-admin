import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as DeptActions from 'modules/DeptModule';
import GRConfirm from 'components/GRComponents/GRConfirm';

import DeptActivateList from 'views/User/DeptActivateList';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ActivateGroupDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const { isOpen, compId, objId } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("lbActivateGroup")}</DialogTitle>
                    <DialogContent>
                        <DeptActivateList name='DeptActivateList' objId={objId} /> 
                    </DialogContent>
                    <DialogActions>
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
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    DeptActions: bindActionCreators(DeptActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ActivateGroupDialog)));
