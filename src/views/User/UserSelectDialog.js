import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getDataObjectVariableInComp } from 'components/GRUtils/GRTableListUtils';

import * as DeptActions from 'modules/DeptModule';
import GRConfirm from 'components/GRComponents/GRConfirm';

import UserListForSelect from 'views/User/UserListForSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserSelectDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          selectedDeptCd: '',
          selectedDeptNm: '',
          selectedUser: []
        };
    }

    handleSelectUser = (newSelectedIds) => {
        this.setState({
            selectedUser: newSelectedIds
        });
    }

    handleAddButton = (event) => {
        if(this.props.onSaveHandle) {
            this.props.onSaveHandle(this.state.selectedUser);
        }
    }

    getParentKey = (selectNm) => {
        const { compId, DeptProps } = this.props;
        const parentItem = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(e => {
            const key = e.get('key');
            if (key === selectNm)
                return key;

            const children = e.get('children');
            if (children && children.size > 0) {
                const find = (children.filter(e => {
                    return (e === selectNm) ? true : false;
                }));
                if (find && 0 < find.size) {
                    return e.get('key');
                }
            }
        });

        if (parentItem) {
            const parentDepth = parentItem.get('depth');
            if (parentDepth != '1')
                return this.getParentKey(parentItem.get('key'));
            return parentItem.get('key');
        }
        else {
            return '';
        }
    }

    render() {
        const { classes } = this.props;
        const { isOpen, compId, DeptProps } = this.props;
        const { t, i18n } = this.props;

        const checkedDeptCd = DeptProps.getIn(['viewItems', compId, 'treeComp', 'checked']);

        let deptNm = '';
        let userType ='';
        if(checkedDeptCd && checkedDeptCd.length > 0) {
            const selectedItem = DeptProps.getIn(['viewItems', compId, 'treeComp', 'treeData']).find(e => (e.get('key') === checkedDeptCd[0]));
            if(selectedItem) {
                deptNm = selectedItem.get('title');
                userType = this.getParentKey(selectedItem.get('key'));
            }
        }

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("lbAddUserInDept", {deptNm:deptNm})}</DialogTitle>
                    <DialogContent>
                        <UserListForSelect name='UserListForSelect' deptCd={this.state.selectedDeptCd}  userType={userType}
                            onSelectUser={this.handleSelectUser}
                        />
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
    DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
    DeptActions: bindActionCreators(DeptActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserSelectDialog)));
