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

import GRTreeList from "components/GRTree/GRTreeList";

import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptSelectDialog extends Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
          selectedDept: { deptCd: '', deptNm: '' }
        };
    }

    handleClose = (event) => {
        this.props.DeptActions.closeMultiDialog();
    }

    handleSelectDept = (listItem) => {
        this.setState({
            selectedDept: { deptCd: listItem.key, deptNm: listItem.title }
        });
    }

    handleSaveDept = (event) => {
        if(this.props.onSaveHandle) {
            this.props.onSaveHandle(this.state.selectedDept);
        }
    }

    render() {
        const { classes } = this.props;
        const { isOpen, compId, isShowCheck } = this.props;
        const { t, i18n } = this.props;

        return (
            <div>
            {(isOpen) &&
                <Dialog open={isOpen} scroll="paper" fullWidth={true} maxWidth="xs">
                    <DialogTitle>{t("dtSelectDept")}</DialogTitle>
                    <DialogContent>
                        <GRTreeList
                            useFolderIcons={true}
                            listHeight='24px'
                            url='readChildrenDeptList'
                            paramKeyName='deptCd'
                            rootKeyValue='0'
                            keyName='key'
                            title='title'
                            startingDepth='1'
                            isShowCheck={isShowCheck}
                            hasSelectChild={false}
                            hasSelectParent={false}
                            compId={compId}
                            onSelectNode={this.handleSelectDept}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSaveDept} variant='contained' color="secondary">{t("btnSelect")}</Button>
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
    DeptActions: bindActionCreators(DeptActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptSelectDialog)));
