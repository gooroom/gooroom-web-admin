import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import GRConfirm from 'components/GRComponents/GRConfirm';

import GRTreeList from "components/GRTree/GRTreeList";
import UserListForSelect from 'views/User/UserListForSelect';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class UserSelectDialog extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
          selectedDeptCd: '',
          selectedDeptNm: '',
          selectedUser: []
        };
    }

    // handleSelectDept = (node) => {
    //     this.setState({
    //         selectedDeptCd: node.key, 
    //         selectedDeptNm: node.title
    //     });
    // }

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

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{"조직(" + selectedDept.deptNm + ")에 사용자 추가"}</DialogTitle>
                    <DialogContent>
                        <UserListForSelect name='UserListForSelect' deptCd={this.state.selectedDeptCd} 
                            onSelectUser={this.handleSelectUser}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAddButton} variant='contained' color="secondary">추가</Button>
                        <Button onClick={this.props.onClose} variant='contained' color="primary">닫기</Button>
                    </DialogActions>
                    <GRConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

export default withStyles(GRCommonStyle)(UserSelectDialog);
