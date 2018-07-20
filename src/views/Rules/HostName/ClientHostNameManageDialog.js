import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { css } from "glamor";

import { withStyles } from '@material-ui/core/styles';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import GrConfirm from 'components/GrComponents/GrConfirm';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Radio from '@material-ui/core/Radio';

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
class ClientHostNameManageDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.ClientHostNameActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.ClientHostNameActions.setEditingItemValue({
                name: name,
                value: event.target.checked
            });
        } else {
            this.props.ClientHostNameActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleNtpValueChange = index => event => {
        this.props.ClientHostNameActions.setSelectedNtpValue({
            index: index,
            value: event.target.value
        });
    }

    handleChangeSelectedNtp = (name, index) => event => {
        this.props.ClientHostNameActions.setEditingItemValue({
            name: name,
            value: index
        });
    }

    handleCreateData = (event) => {
        const { ClientHostNameProps, ClientHostNameActions } = this.props;
        ClientHostNameActions.createClientHostNameData(ClientHostNameProps.editingItem)
        .then(() => {
                ClientHostNameActions.readClientHostNameList(ClientHostNameProps.listParam);
                this.handleClose();
        }, (res) => {

        })
    }

    handleEditData = (event) => {
        const { GrConfirmActions } = this.props;
        const re = GrConfirmActions.showConfirm({
            confirmTitle: 'Hosts 정보 수정',
            confirmMsg: 'Hosts 정보를 수정하시겠습니까?',
            confirmOpen: true,
            handleConfirmResult: this.handleEditConfirmResult
          });
    }
    handleEditConfirmResult = (confirmValue) => {
        if(confirmValue) {
            const { ClientHostNameProps, ClientHostNameActions } = this.props;
            ClientHostNameActions.editClientHostNameData(ClientHostNameProps.editingItem)
                .then((res) => {

                    const { editingCompId, [editingCompId + '__selectedItem'] : selectedItem } = ClientHostNameProps;
                    if(editingCompId && editingCompId != '') {
                        ClientHostNameActions.getClientHostName({
                            compId: editingCompId,
                            objId: selectedItem.objId
                        });
                    } else {
                        // update list 
                        ClientHostNameActions.readClientHostNameList(ClientHostNameProps.listParam);
                    }

                this.handleClose();
            }, (res) => {

            })
        }
    }

    handleAddNtp = () => {
        const { ClientHostNameActions } = this.props;
        ClientHostNameActions.addNtpAddress();
    }

    handleDeleteNtp = index => event => {
        const { ClientHostNameActions } = this.props;
        ClientHostNameActions.deleteNtpAddress(index);
    }

    render() {

        const { ClientHostNameProps } = this.props;
        const { dialogType, editingItem } = ClientHostNameProps;

        let title = "";
        const bull = <span className={bullet}>•</span>;

        if(dialogType === ClientHostNameManageDialog.TYPE_ADD) {
            title = "Hosts정책 등록";
        } else if(dialogType === ClientHostNameManageDialog.TYPE_VIEW) {
            title = "Hosts정책 정보";
        } else if(dialogType === ClientHostNameManageDialog.TYPE_EDIT) {
            title = "Hosts정책 수정";
        }

        return (
            <Dialog open={ClientHostNameProps.dialogOpen}>
                <DialogTitle>{title}</DialogTitle>
                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                        label="이름"
                        value={(editingItem) ? editingItem.objNm : ''}
                        onChange={this.handleValueChange("objNm")}
                        className={fullWidthClass}
                        disabled={(dialogType === ClientHostNameManageDialog.TYPE_VIEW)}
                    />
                    <TextField
                        label="설명"
                        value={(editingItem) ? editingItem.comment : ''}
                        onChange={this.handleValueChange("comment")}
                        className={classNames(fullWidthClass, itemRowClass)}
                        disabled={(dialogType === ClientHostNameManageDialog.TYPE_VIEW)}
                    />
                    {(dialogType === ClientHostNameManageDialog.TYPE_VIEW) &&
                        <div>
                            <TextField
                                label="Hosts 정보"
                                multiline
                                value={(editingItem.hosts) ? editingItem.hosts : ''}
                                className={classNames(fullWidthClass, itemRowClass)}
                                disabled
                            />
                        </div>                        
                    }
                    {(dialogType === ClientHostNameManageDialog.TYPE_EDIT || dialogType === ClientHostNameManageDialog.TYPE_ADD) &&
                        <div>
                            <TextField
                                label="Hosts 정보"
                                multiline
                                value={(editingItem.hosts) ? editingItem.hosts : ''}
                                onChange={this.handleValueChange("hosts")}
                                className={classNames(fullWidthClass, itemRowClass)}
                            />
                        </div>
                    }
                </form>

                <DialogActions>
                {(dialogType === ClientHostNameManageDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                }
                {(dialogType === ClientHostNameManageDialog.TYPE_EDIT) &&
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
    ClientHostNameProps: state.ClientHostNameModule
});

const mapDispatchToProps = (dispatch) => ({
    ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ClientHostNameManageDialog));

