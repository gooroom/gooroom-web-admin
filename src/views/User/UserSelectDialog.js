import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import GrConfirm from 'components/GrComponents/GrConfirm';

import GrTreeList from "components/GrTree/GrTreeList";
import UserListInDept from 'views/User/UserListInDept';

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
import { GrCommonStyle } from 'templates/styles/GrStyles';


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

    componentDidMount() {
        //console.log('props :::::::::: ', this.props);
    }

    handleSelectDept = (node) => {
        this.setState({
            selectedDeptCd: node.key, 
            selectedDeptNm: node.title
        });
    }

    handleSelectUser = (newSelectedIds) => {
        this.setState({
            selectedUser: newSelectedIds
        })
    }

    handleAddButton = (event) => {

        // console.log('handleAddButton........................');

        // console.log('deptCd : ' + this.state.selectedDeptCd);
        // console.log('users : ' + this.state.selectedUser);

        if(this.props.onSaveHandle) {
            this.props.onSaveHandle(this.state.selectedUser);
        }

        // requestPostAPI('readUserListPagedInDept', {
        //   deptCd: newListParam.get('deptCd'),
        //   keyword: newListParam.get('keyword'),
        //   status: newListParam.get('status'),
        //   page: newListParam.get('page'),
        //   start: newListParam.get('page') * newListParam.get('rowsPerPage'),
        //   length: newListParam.get('rowsPerPage'),
        //   orderColumn: newListParam.get('orderColumn'),
        //   orderDir: newListParam.get('orderDir')
        // }).then(
        //   (response) => {
        //     const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = response.data;
    
        //     const { stateData } = this.state;
        //     this.setState({
        //       stateData: stateData
        //         .set('listData', List(data.map((e) => {return Map(e)})))
        //         .set('listParam', newListParam.merge({
        //           rowsFiltered: parseInt(recordsFiltered, 10),
        //           rowsTotal: parseInt(recordsTotal, 10),
        //           page: parseInt(draw, 10),
        //           rowsPerPage: parseInt(rowLength, 10),
        //           orderColumn: orderColumn,
        //           orderDir: orderDir
        //         }))
        //     });
        //   }
        // ).catch(error => {
        // });
    
    }

    // static TYPE_VIEW = 'VIEW';
    // static TYPE_ADD = 'ADD';
    // static TYPE_EDIT = 'EDIT';

    // handleClose = (event) => {
    //     this.props.UserActions.closeDialog();
    // }

    // handleValueChange = name => event => {
    //     const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    //     this.props.UserActions.setEditingItemValue({
    //         name: name,
    //         value: value
    //     });
    // }

    // handleMouseDownPassword = event => {
    //     event.preventDefault();
    // };

    // handleClickShowPassword = () => {
    //     const { UserProps, UserActions } = this.props;
    //     const editingItem = UserProps.get('editingItem');
    //     UserActions.setEditingItemValue({
    //         name: 'showPassword',
    //         value: !editingItem.get('showPassword')
    //     });
    // };

    // // 데이타 생성
    // handleCreateData = (event) => {
    //     const { UserProps, GrConfirmActions } = this.props;
    //     GrConfirmActions.showConfirm({
    //         confirmTitle: '사용자정보 등록',
    //         confirmMsg: '사용자정보를 등록하시겠습니까?',
    //         handleConfirmResult: this.handleCreateConfirmResult,
    //         confirmOpen: true,
    //         confirmObject: UserProps.get('editingItem')
    //     });
    // }
    // handleCreateConfirmResult = (confirmValue, paramObject) => {
    //     if(confirmValue) {
    //         const { UserProps, UserActions, compId } = this.props;
    //         UserActions.createUserData({
    //             userId: UserProps.getIn(['editingItem', 'userId']),
    //             userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
    //             userNm: UserProps.getIn(['editingItem', 'userNm'])
    //         }).then((res) => {
    //             UserActions.readUserListPaged(UserProps, compId);
    //             this.handleClose();
    //         });
    //     }
    // }

    // handleEditData = (event) => {
    //     const { UserProps, GrConfirmActions } = this.props;
    //     GrConfirmActions.showConfirm({
    //         confirmTitle: '사용자정보 수정',
    //         confirmMsg: '사용자정보를 수정하시겠습니까?',
    //         handleConfirmResult: this.handleEditConfirmResult,
    //         confirmOpen: true,
    //         confirmObject: UserProps.get('editingItem')
    //     });
    // }
    // handleEditConfirmResult = (confirmValue, paramObject) => {
    //     if(confirmValue) {
    //         const { UserProps, UserActions, compId } = this.props;

    //         UserActions.editUserData({
    //             userId: UserProps.getIn(['editingItem', 'userId']),
    //             userPasswd: UserProps.getIn(['editingItem', 'userPasswd']),
    //             userNm: UserProps.getIn(['editingItem', 'userNm'])
    //         }).then((res) => {
    //             UserActions.readUserListPaged(UserProps, compId);
    //             this.handleClose();
    //         });
    //     }
    // }

    render() {
        const { classes } = this.props;
        const { isOpen, UserProps } = this.props;

        let title = '사용자 선택';

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} fullWidth={true} >
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={8}>
                            {/* <Grid item xs={12} sm={12} lg={4}>
                                <Card className={classNames(classes.deptTreeCard)}>
                                    <GrTreeList
                                        useFolderIcons={true}
                                        listHeight='24px'
                                        url='readChildrenDeptList'
                                        paramKeyName='deptCd'
                                        rootKeyValue='0'
                                        keyName='key'
                                        title='title'
                                        startingDepth='2'
                                        onSelectNode={this.handleSelectDept}
                                    />
                                </Card>
                            </Grid> */}
                            <Grid item xs={12} sm={12} lg={12}>
                                <Card className={classes.deptUserCard}>
                                    <CardContent>
                                        <UserListInDept name='UserListInDept' deptCd={this.state.selectedDeptCd} 
                                            onSelectUser={this.handleSelectUser}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleAddButton} variant='raised' color="secondary">추가</Button>
                        <Button onClick={this.props.onClose} variant='raised' color="primary">닫기</Button>
                    </DialogActions>
                    <GrConfirm />
                </Dialog>
            }
            </div>
        );
    }
}

export default withStyles(GrCommonStyle)(UserSelectDialog);
