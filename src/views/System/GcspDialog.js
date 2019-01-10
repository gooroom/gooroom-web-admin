import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as GcspManageActions from 'modules/GcspManageModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Grid from '@material-ui/core/Grid';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class GcspDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.GcspManageActions.closeDialog(this.props.compId);
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? ((event.target.checked) ? '' : 'disallow') : event.target.value;
        this.props.GcspManageActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    // 생성
    handleCreateData = (event) => {
        const { GcspManageProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '클라우드서비스 등록',
                confirmMsg: '클라우드서비스를 등록하시겠습니까?',
                handleConfirmResult: this.handleCreateConfirmResult,
                confirmObject: GcspManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { GcspManageProps, GcspManageActions, compId } = this.props;
            GcspManageActions.createGcspData({
                gcspId: paramObject.get('gcspId'),
                gcspNm: paramObject.get('gcspNm'),
                comment: paramObject.get('comment'),
                ipRanges: paramObject.get('ipRanges'),
                url: paramObject.get('url'),
                certGubun: paramObject.get('certGubun'),
                gcspCsr: paramObject.get('gcspCsr')
            }).then((res) => {
                GcspManageActions.readGcspListPaged(GcspManageProps, compId);
                this.handleClose();
            });
        }
    }

    // 수정
    handleEditData = (event) => {
        const { GcspManageProps, GRConfirmActions } = this.props;
        if(this.refs.form && this.refs.form.isFormValid()) {
            GRConfirmActions.showConfirm({
                confirmTitle: '클라우드서비스 수정',
                confirmMsg: '클라우드서비스를 수정하시겠습니까?',
                handleConfirmResult: this.handleEditDataConfirmResult,
                confirmObject: GcspManageProps.get('editingItem')
            });
        } else {
            if(this.refs.form && this.refs.form.childs) {
                this.refs.form.childs.map(c => {
                    this.refs.form.validate(c);
                });
            }
        }        
    }
    handleEditDataConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { GcspManageProps, GcspManageActions, compId } = this.props;
            GcspManageActions.editGcspData({
                gcspId: paramObject.get('gcspId'),
                gcspNm: paramObject.get('gcspNm'),
                comment: paramObject.get('comment'),
                ipRanges: paramObject.get('ipRanges'),
                url: paramObject.get('url')
            }).then((res) => {
                GcspManageActions.readGcspListPaged(GcspManageProps, compId);
                this.handleClose();
            });
        }
    }

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        const { GcspManageProps, GcspManageActions } = this.props;
        const editingItem = GcspManageProps.get('editingItem');
        GcspManageActions.setEditingItemValue({
            name: 'showPasswd',
            value: !editingItem.get('showPasswd')
        });
    };

    render() {
        const { classes } = this.props;
        const { GcspManageProps, compId } = this.props;

        const dialogType = GcspManageProps.get('dialogType');
        const editingItem = (GcspManageProps.get('editingItem')) ? GcspManageProps.get('editingItem') : null;

        let title = "";
        if(dialogType === GcspDialog.TYPE_ADD) {
            title = "클라우드서비스 등록";
        } else if(dialogType === GcspDialog.TYPE_VIEW) {
            title = "클라우드서비스 정보";
        } else if(dialogType === GcspDialog.TYPE_EDIT) {
            title = "클라우드서비스 수정";
        }

        return (
            <div>
            {(GcspManageProps.get('dialogOpen') && editingItem) &&
            <Dialog open={GcspManageProps.get('dialogOpen')}>
                <ValidatorForm ref="form">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                            <TextValidator
                                label="서비스아이디"
                                value={(editingItem.get('gcspId')) ? editingItem.get('gcspId') : ''}
                                name="gcspId" validators={['required', 'matchRegexp:^[a-zA-Z0-9_.-]*$']} 
                                errorMessages={['서비스아이디를 입력하세요.', '알파벳,숫자,"-","_","." 문자만 입력하세요.']}
                                onChange={
                                    (dialogType == GcspDialog.TYPE_VIEW || dialogType == GcspDialog.TYPE_EDIT) ? null : this.handleValueChange("gcspId")
                                }
                                className={classes.fullWidth}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextValidator
                                label="서비스이름"
                                value={(editingItem.get('gcspNm')) ? editingItem.get('gcspNm') : ''}
                                name="gcspNm" validators={['required']} errorMessages={['서비스이름을 입력하세요.']}
                                onChange={
                                    (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("gcspNm")
                                }
                                className={classes.fullWidth}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="서비스설명"
                        value={(editingItem.get('comment')) ? editingItem.get('comment') : ''}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("comment")
                        }
                        className={classes.fullWidth}
                    />
                    <TextField
                        label="접근가능 IP"
                        value={(editingItem.get('ipRanges')) ? editingItem.get('ipRanges') : ''}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("ipRanges")
                        }
                        className={classes.fullWidth}
                    />
                    <TextField
                        label="서비스 도메인"
                        value={(editingItem.get('url')) ? editingItem.get('url') : ''}
                        onChange={
                            (dialogType == GcspDialog.TYPE_VIEW) ? null : this.handleValueChange("url")
                        }
                        className={classes.fullWidth}
                    />

                    {(dialogType == GcspDialog.TYPE_ADD) &&
                        <div>
                            <FormControl component="fieldset" style={{marginTop:20}}>
                                <FormLabel component="legend">인증서 생성 방법</FormLabel>
                                <RadioGroup row={true}
                                    aria-label="gender"
                                    name="gender2"
                                    style={{marginTop:20}}
                                    value={(editingItem.get('certGubun')) ? editingItem.get('certGubun') : ''}
                                    onChange={this.handleValueChange('certGubun')}
                                >
                                    <FormControlLabel value="cert1" control={<Radio />} label="자동 생성" />
                                    <FormControlLabel value="cert2" control={<Radio />} label="CSR 생성" />
                                </RadioGroup>
                                <FormHelperText>
                                {
                                    (editingItem.get('certGubun') === 'cert1') ? "구름서버에서 인증서를 자동으로 생성합니다." : "CSR정보를 이용하여 인증서를 승인합니다."
                                }
                                </FormHelperText>
                            </FormControl>
                            {(editingItem.get('certGubun') === 'cert2') && 
                                <TextField label="CSR 정보"
                                    margin="normal"
                                    multiline={true}
                                    rows={5}
                                    fullWidth={true}
                                    variant="outlined"
                                    onChange={this.handleValueChange("gcspCsr")}
                                />
                            }
                        </div>
                    }
                    {(dialogType == GcspDialog.TYPE_VIEW) && 
                        <div style={{marginTop:20}}>
                           <FormLabel component="legend">인증서 정보</FormLabel>
                           <TextField label="인증서"
                                margin="normal"
                                multiline={true}
                                rows={5}
                                fullWidth={true}
                                variant="outlined"
                                value={(editingItem.get('cert')) ? editingItem.get('cert') : ''}
                           />
                           <TextField label="개인키"
                                margin="normal"
                                multiline={true}
                                rows={5}
                                fullWidth={true}
                                variant="outlined"
                                value={(editingItem.get('priv')) ? editingItem.get('priv') : ''}
                           />
                       </div>
                     
                    }
                </DialogContent>
                <DialogActions>
                    {(dialogType === GcspDialog.TYPE_ADD) &&
                        <Button onClick={this.handleCreateData} variant='contained' color="secondary">{t("btnRegist")}</Button>
                    }
                    {(dialogType === GcspDialog.TYPE_EDIT) &&
                        <Button onClick={this.handleEditData} variant='contained' color="secondary">{t("btnSave")}</Button>
                    }
                    <Button onClick={this.handleClose} variant='contained' color="primary">{t("btnClose")}</Button>
                </DialogActions>
                </ValidatorForm>
            </Dialog>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    GcspManageProps: state.GcspManageModule
});

const mapDispatchToProps = (dispatch) => ({
    GcspManageActions: bindActionCreators(GcspManageActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(GcspDialog));

