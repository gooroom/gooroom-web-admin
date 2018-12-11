import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import ClientProfilePackageList from 'views/ClientSupport/ClientProfilePackageList';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientProfilePackageShowDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            stateData: Map({
                selectedPackage: List([])
            })
        };
    }

    render() {
        const { compId, isOpen, selectedClientId, selectedProfileNo, keyword, onChangeKeyword } = this.props;
        return (
            <React.Fragment>
            {(isOpen) &&
                <Dialog open={isOpen} maxWidth="xs" >
                    <DialogTitle>패키지 정보</DialogTitle>
                    <DialogContent>
                        <ClientProfilePackageList compId={compId} 
                            clientId={selectedClientId} 
                            profileNo={selectedProfileNo} 
                            onChangeKeyword={onChangeKeyword}
                            keyword={keyword}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} variant='contained' color="primary" style={{marginLeft:10}}>닫기</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            <GRAlert />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
    GlobalActions: bindActionCreators(GlobalActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientProfilePackageShowDialog));
