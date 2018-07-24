import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from "glamor";

import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

//
//  ## Style ########## ########## ########## ########## ##########
//
const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  });

const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 300,
    minWidth: 500
}).toString();

const fullWidthClass = css({
    width: "100%"
}).toString();

const keyCreateBtnClass = css({
    paddingTop: 24 + " !important"
}).toString();  

const labelClass = css({
    height: "25px",
    marginTop: "10px"
}).toString();

const itemRowClass = css({
    marginTop: "10px !important"
}).toString();

const bullet = css({
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  }).toString();

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientUpdateServerManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientUpdateServerActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientUpdateServerActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.ClientUpdateServerActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { ClientUpdateServerProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 등록',
            confirmMsg: '업데이트서버 정보를 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmOpen: true,
            confirmObject: ClientUpdateServerProps.editingItem
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.createClientUpdateServerData(ClientUpdateServerProps.editingItem)
                .then((res) => {
                    const { viewItems } = ClientUpdateServerProps;
                    if(viewItems) {
                        viewItems.forEach((element) => {
                            if(element && element.listParam) {
                                ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(element.listParam, {
                                    compId: element._COMPID_
                                }));
                            }
                        });
                    }
                    this.handleClose();
                }, (res) => {
            })
        }
    }

    handleEditData = (event) => {
        const { ClientUpdateServerProps, GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: '업데이트서버 정보 수정',
            confirmMsg: '업데이트서버 정보를 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmOpen: true,
            confirmObject: ClientUpdateServerProps.editingItem
          });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {


        if(confirmValue) {
            const { ClientUpdateServerProps, ClientUpdateServerActions } = this.props;
            ClientUpdateServerActions.editClientUpdateServerData(ClientUpdateServerProps.editingItem)
                .then((res) => {

                    const { editingCompId, viewItems } = ClientUpdateServerProps;
                    viewItems.forEach((element) => {
                        if(element && element.listParam) {
                            ClientUpdateServerActions.readClientUpdateServerList(getMergedObject(element.listParam, {
                                compId: element._COMPID_
                            }));
                        }
                    });

                    ClientUpdateServerActions.getClientUpdateServer({
                        compId: editingCompId,
                        objId: paramObject.objId
                    });

                this.handleClose();
            }, (res) => {

            })
        }
    }

    render() {

        const { ClientUpdateServerProps } = this.props;
        const { dialogType, editingItem } = ClientUpdateServerProps;

        const editingViewItem = editingItem;

        let title = "";
        const bull = <span className={bullet}>•</span>;

        if(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) {
            title = "업데이트서버정책 등록";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) {
            title = "업데이트서버정책 정보";
        } else if(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) {
            title = "업데이트서버정책 수정";
        }

        return (
            <Dialog open={ClientUpdateServerProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        label="이름"
                        value={(editingViewItem) ? editingViewItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    <TextField
                        label="설명"
                        value={(editingViewItem) ? editingViewItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_VIEW) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingViewItem.mainos) ? editingViewItem.mainos : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingViewItem.extos) ? editingViewItem.extos : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingViewItem.priorities) ? editingViewItem.priorities : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT || dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                label="주 OS 정보"
                                multiline
                                value={(editingViewItem.mainos) ? editingViewItem.mainos : ''}
                                onChange={this.handleValueChange("mainos")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <TextField
                                label="기반 OS 정보"
                                multiline
                                value={(editingViewItem.extos) ? editingViewItem.extos : ''}
                                onChange={this.handleValueChange("extos")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                            <TextField
                                label="gooroom.pref"
                                multiline
                                value={(editingViewItem.priorities) ? editingViewItem.priorities : ''}
                                onChange={this.handleValueChange("priorities")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientUpdateServerManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientUpdateServerManageDialog.TYPE_EDIT) &&
                    <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                }
                <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                </DialogActions>
                <GrConfirm />
            </Dialog>
        );
    }

}

const mapStateToProps = (state) => ({
    ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ClientUpdateServerManageDialog));

