import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DashboardActions from 'modules/DashboardModule';

import GRConfirm from 'components/GRComponents/GRConfirm';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class UserInfoDialog extends Component {

    render() {
        const { classes } = this.props;
        const { DashboardProps } = this.props;

        return (
            <div>
            {(DashboardProps.get('userInfoDialog')) &&
                <Dialog open={DashboardProps.get('userInfoDialog')} fullWidth={true} >
                    <DialogTitle>DialogTitle</DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">닫기</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    DashboardProps: state.DashboardModule
});

const mapDispatchToProps = (dispatch) => ({
    DashboardActions: bindActionCreators(DashboardActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserInfoDialog));
