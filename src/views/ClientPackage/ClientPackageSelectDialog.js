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

import ClientPackageTotalListForSelect from 'views/ClientPackage/ClientPackageTotalListForSelect';

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

    handleUpdatePackageList = (event) => {

        event.stopPropagation();
        this.props.GRConfirmActions.showConfirm({
        confirmTitle: '패키지리스트 업데이트',
        confirmMsg: '패키지리스트를 업데이트 하겠습니까?',
        handleConfirmResult: (confirmValue, confirmObject) => {
            if(confirmValue) {
            const { ClientManageProps, ClientPackageActions, compId } = this.props;
            ClientPackageActions.updatePackageList({
                compId: compId
            }).then((response) => {
                if(response && response.data && response.data.status && response.data.status.result === 'success') {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: '업데이트 완료',
                      alertMsg: '패키지 리스트를 업데이트 하기 위하여 작업(JOB)이 생성되었습니다. 1~3분 정도 기다린후 확인하시기 바랍니다.'
                    });
                    this.getSeverUrlInfo();
                  } else {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: '시스템오류',
                      alertMsg: '패키지 리스트 업데이트 작업이 수행되지 못하였습니다.'
                  });
                  this.getSeverUrlInfo();
                }
            });
            }
        },
        });
    }

    render() {
        const { isOpen } = this.props;

        return (
            <React.Fragment>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>패키지 선택</DialogTitle>
                    <DialogContent>
                        <ClientPackageTotalListForSelect name='ClientPackageTotalListForSelect' 
                            onSelectPackage={this.handleSelectPackage}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid container >
                            <Grid item xs={6}>
                            <Button onClick={this.handleUpdatePackageList} variant='contained' color="secondary">전체리스트 업데이트</Button>
                            </Grid>
                            <Grid item xs={6} style={{flex:'1 0',display:'flex',justifyContent:'flex-end'}}>
                            <Button onClick={this.handleInstallButton} variant='contained' color="secondary">설치</Button>
                            <Button onClick={this.props.onClose} variant='contained' color="primary" style={{marginLeft:10}}>닫기</Button>
                            </Grid>
                        </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientPackageSelectDialog));
