import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import ClientPackageTotalListForSelect from 'views/ClientPackage/ClientPackageTotalListForSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientPackageSelectDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            stateData: Map({
                selectedPackage: List([])
            })
        };
    }

    handleSelectPackage = (newSelectedIds) => {
        this.setState(({stateData}) => ({
            stateData: stateData.set('selectedPackage', List(newSelectedIds))
        }));
    }

    handleInstallButton = (event) => {
        const selectedPackage = this.state.stateData.get('selectedPackage');
        if(selectedPackage && selectedPackage.size > 0) {
            if(this.props.onInstallHandle) {
                this.props.onInstallHandle(selectedPackage);
            }
        } else {
            this.props.GlobalActions.showElementMsg(event.currentTarget, '설치할 패키지가 선택되지 않았습니다.');
        }
    }
    
    render() {
        const { isOpen } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>패키지 선택</DialogTitle>
                    <DialogContent>
                        <ClientPackageTotalListForSelect name='ClientPackageTotalListForSelect' 
                            onSelectPackage={this.handleSelectPackage}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleInstallButton} variant='raised' color="secondary">설치</Button>
                        <Button onClick={this.props.onClose} variant='raised' color="primary">닫기</Button>
                    </DialogActions>
                    <GrConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    GlobalActions: bindActionCreators(GlobalActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(ClientPackageSelectDialog));
