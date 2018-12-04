import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import sha256 from 'sha-256-js';

import * as AdminUserActions from 'modules/AdminUserModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { requestPostAPI } from 'components/GRUtils/GRRequester';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import FormLabel from '@material-ui/core/FormLabel';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class AdminUserConnDialog extends Component {

    handleClickClose = (event) => {
        this.props.AdminUserActions.closeConnDialog();
    }

    // 수정
    handleClickSaveData = (event) => {
        const { AdminUserProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '접속가능 아이피 저장',
            confirmMsg: '접속가능 아이피 정보를 저장하시겠습니까?',
            handleConfirmResult: (confirmValue, paramObject) => {
                if(confirmValue) {
                    this.props.AdminUserActions.updateAdminAddress({
                        adminAddresses: (paramObject) ? paramObject.toArray() : []
                    }).then((res) => {
                        this.handleClickClose();
                    });
                }
            },
            confirmObject: AdminUserProps.get('gpmsAllowIps')
        });
    }

    handleIpValueChange = index => event => {
        this.props.AdminUserActions.setAdminConnIpValue({
            index: index,
            value: event.target.value
        });
    }
    handleDeleteIp = index => event => {
        this.props.AdminUserActions.deleteAdminConnIp(index);
    }
    handleAddIp = () => {
        this.props.AdminUserActions.addAdminConnIp();
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const { AdminUserProps, compId } = this.props;

        const gpmsAllowIps = AdminUserProps.get('gpmsAllowIps');

        return (
            <div>
            {(AdminUserProps.get('connDialogOpen')) &&
            <Dialog open={AdminUserProps.get('connDialogOpen')}>
                <DialogTitle>관리자 접속 가능 아이피</DialogTitle>
                <DialogContent>
                    <FormLabel style={{marginRight:"20px"}}>{bull} 아이피 목록</FormLabel>
                    <Button onClick={this.handleAddIp} variant="contained" style={{padding:"3px 12px", minWidth: "auto", minHeight: "auto"}} color="secondary">추가</Button>
                    <div style={{maxHeight:140,overflow:'auto',marginTop:20}}>
                        {gpmsAllowIps && gpmsAllowIps.map((value, index) => (
                        <div key={index}>
                            <Input value={value} onChange={this.handleIpValueChange(index)} style={{width:'80%'}} />
                            <IconButton onClick={this.handleDeleteIp(index)} aria-label="WhiteIpDelete">
                                <DeleteForeverIcon />
                            </IconButton>
                        </div>
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClickSaveData} variant='contained' color="secondary">저장</Button>
                    <Button onClick={this.handleClickClose} variant='contained' color="primary">닫기</Button>
                </DialogActions>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
    AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(AdminUserConnDialog));

