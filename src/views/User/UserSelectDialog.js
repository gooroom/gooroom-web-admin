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
        })
    }

    handleAddButton = (event) => {
        if(this.props.onSaveHandle) {
            this.props.onSaveHandle(this.state.selectedUser);
        }
    }

    render() {
        const { classes } = this.props;
        const { isOpen } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{"사용자 선택"}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={8}>
                            {/* <Grid item xs={12} sm={12} lg={4}>
                                <Card className={classNames(classes.deptTreeCard)}>
                                    <GRTreeList
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenDeptList'
                                        paramKeyName='deptCd'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='2'
                                        relative={true}
                                        onSelectNode={this.handleSelectDept}
                                    />
                                </Card>
                            </Grid> */}
                            <Grid item xs={12} sm={12} lg={12}>
                                <Card className={classes.deptUserCard}>
                                    <CardContent>
                                        <UserListForSelect name='UserListForSelect' deptCd={this.state.selectedDeptCd} 
                                            onSelectUser={this.handleSelectUser}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
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
