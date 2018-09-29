import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DeptActions from 'modules/DeptModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { getConfigIdsInComp } from 'components/GrUtils/GrTableListUtils';
import GrConfirm from 'components/GrComponents/GrConfirm';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Divider from '@material-ui/core/Divider';

import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

import BrowserRuleSelector from 'views/Rules/UserConfig/BrowserRuleSelector';
import MediaRuleSelector from 'views/Rules/UserConfig/MediaRuleSelector';
import SecurityRuleSelector from 'views/Rules/UserConfig/SecurityRuleSelector';



function TabContainer(props) {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

//
//  ## Dialog ########## ########## ########## ########## ##########
//
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
        const { DeptProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
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
        const { DeptProps, GrConfirmActions } = this.props;
        GrConfirmActions.showConfirm({
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
                userPasswd: DeptProps.getIn(['editingItem', 'userPasswd']),
                deptNm: DeptProps.getIn(['editingItem', 'deptNm']),

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

    render() {
        const { classes } = this.props;
        const { DeptProps, compId } = this.props;

        const dialogType = DeptProps.get('dialogType');
        const editingItem = (DeptProps.get('editingItem')) ? DeptProps.get('editingItem') : null;

        const tabValue = DeptProps.get('dialogTabValue');

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
                <Dialog open={DeptProps.get('dialogOpen')}>
                    <DialogTitle>{title}</DialogTitle>
                    <form noValidate autoComplete="off" className={classes.dialogContainer}>
                    
                        <TextField
                            label="상위조직"
                            value={upperDeptInfo}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            disabled={true}
                        />

                        <TextField
                            label="조직아이디"
                            value={(editingItem.get('deptCd')) ? editingItem.get('deptCd') : ''}
                            onChange={this.handleValueChange("deptCd")}
                            className={classNames(classes.fullWidth, classes.dialogItemRow)}
                            disabled={(dialogType == DeptDialog.TYPE_EDIT) ? true : false}
                        />
                        <TextField
                            label="조직이름"
                            value={(editingItem.get('deptNm')) ? editingItem.get('deptNm') : ''}
                            onChange={this.handleValueChange("deptNm")}
                            className={classes.fullWidth}
                        />

                        <Divider style={{marginBottom: 10}} />        
                        <AppBar position="static" color="default">
                            <Tabs value={tabValue} onChange={this.handleChangeTabs}>
                                <Tab label="브라우져정책" />
                                <Tab label="매체제어정책" />
                                <Tab label="단말보안정책" />
                            </Tabs>
                        </AppBar>
                        {tabValue === 0 && <BrowserRuleSelector compId={compId} initId={DeptProps.getIn(['editingItem', 'browserRuleId'])} />}
                        {tabValue === 1 && <MediaRuleSelector compId={compId} initId={DeptProps.getIn(['editingItem', 'mediaRuleId'])} />}
                        {tabValue === 2 && <SecurityRuleSelector compId={compId} initId={DeptProps.getIn(['editingItem', 'clientSecuRuleId'])} />}

                    </form>

                    <DialogActions>
                        {(dialogType === DeptDialog.TYPE_ADD) &&
                            <Button onClick={this.handleCreateData} variant='raised' color="secondary">등록</Button>
                        }
                        {(dialogType === DeptDialog.TYPE_EDIT) &&
                            <Button onClick={this.handleEditData} variant='raised' color="secondary">저장</Button>
                        }
                        <Button onClick={this.handleClose} variant='raised' color="primary">닫기</Button>
                    </DialogActions>
                    <GrConfirm />
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
    GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(DeptDialog));
