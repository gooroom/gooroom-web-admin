import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DeptActions from 'modules/DeptModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import UserRuleSelector from 'components/GROptions/UserRuleSelector';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class DeptDialog extends Component {
    
    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.DeptActions.closeDialog();
    }

    handleValueChange = name => event => {
        const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
        this.props.DeptActions.setEditingItemValue({
            name: name,
            value: value
        });
    }

    handleCreateData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '조직정보 등록',
            confirmMsg: '조직정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: DeptProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DeptProps, DeptActions, compId, resetCallback } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            DeptActions.createDeptInfo({
                deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                deptNm: DeptProps.getIn(['editingItem', 'deptNm']),
                uprDeptCd: DeptProps.getIn(['editingItem', 'selectedDeptCd']),

                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                clientSecuRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId'])
            }).then((res) => {
                // DeptActions.readDeptListPaged(DeptProps, compId);
                // tree refresh
                resetCallback(DeptProps.getIn(['editingItem', 'selectedDeptCd']));
                this.handleClose();
            });
        }
    }

    handleEditData = (event) => {
        const { DeptProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '조직정보 수정',
            confirmMsg: '조직정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: DeptProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DeptProps, DeptActions, compId } = this.props;
            const { BrowserRuleProps, MediaRuleProps, SecurityRuleProps } = this.props;

            DeptActions.editDeptInfo({
                deptCd: DeptProps.getIn(['editingItem', 'deptCd']),
                deptNm: DeptProps.getIn(['editingItem', 'deptNm']),

                browserRuleId: BrowserRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                mediaRuleId: MediaRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId']),
                securityRuleId: SecurityRuleProps.getIn(['viewItems', compId, 'selectedOptionItemId'])
            }).then((res) => {
                // DeptActions.readDeptListPaged(DeptProps, compId);
                // tree refresh
                // resetCallback(DeptProps.getIn(['editingItem', 'selectedDeptCd']));
                this.handleClose();
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { DeptProps, compId } = this.props;

        const dialogType = DeptProps.get('dialogType');
        const editingItem = (DeptProps.get('editingItem')) ? DeptProps.get('editingItem') : null;

        let title = "";
        if(dialogType === DeptDialog.TYPE_ADD) {
            title = "조직 등록";
        } else if(dialogType === DeptDialog.TYPE_VIEW) {
            title = "조직 정보";
        } else if(dialogType === DeptDialog.TYPE_EDIT) {
            title = "조직 수정";
        }

        const upperDeptInfo = DeptProps.getIn(['viewItems', compId, 'selectedDeptNm']) +
            ' (' + DeptProps.getIn(['viewItems', compId, 'selectedDeptCd']) + ')';

        return (
            <div>
            {(DeptProps.get('dialogOpen') && editingItem) &&
                <Dialog open={DeptProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="md">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                        <TextField
                            label="상위조직"
                            value={upperDeptInfo}
                            className={classes.fullWidth}
                        />
                        }
                        <TextField
                            label="조직아이디"
                            value={(editingItem.get('deptCd')) ? editingItem.get('deptCd') : ''}
                            onChange={this.handleValueChange("deptCd")}
                            className={classes.fullWidth}
                            disabled={(dialogType == DeptDialog.TYPE_EDIT) ? true : false}
                        />
                        <TextField
                            label="조직이름"
                            value={(editingItem.get('deptNm')) ? editingItem.get('deptNm') : ''}
                            onChange={this.handleValueChange("deptNm")}
                            className={classes.fullWidth}
                        />
                        <Divider style={{marginBottom: 10}} />
                        <UserRuleSelector compId={compId} module={DeptProps.get('editingItem').toJS()} />
                    </DialogContent>
                    <DialogActions>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                        }
                        {(dialogType === DeptDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='contained' color="secondary">저장</Button>
                        }
                        <Button onClick={this.handleClose} variant='contained' color="primary">닫기</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }

}

const mapStateToProps = (state) => ({
    DeptProps: state.DeptModule,
    BrowserRuleProps: state.BrowserRuleModule,
    MediaRuleProps: state.MediaRuleModule,
    SecurityRuleProps: state.SecurityRuleModule
});

const mapDispatchToProps = (dispatch) => ({
    DeptActions: bindActionCreators(DeptActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptDialog));
