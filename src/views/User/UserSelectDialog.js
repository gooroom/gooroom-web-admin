import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

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

    render() {
        const { classes } = this.props;
        const { isOpen, selectedDept } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{t("lbAddUserInDept", {deptNm:selectedDept.deptNm})}</DialogTitle>
                    <DialogContent>
                        <UserListForSelect name='UserListForSelect' deptCd={this.state.selectedDeptCd} 
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

export default translate("translations")(withStyles(GRCommonStyle)(UserSelectDialog));
