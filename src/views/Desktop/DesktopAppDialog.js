import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as DesktopAppActions from 'modules/DesktopAppModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import { refreshDataListInComp } from 'components/GRUtils/GRTableListUtils';

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

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

import AddIcon from '@material-ui/icons/Add';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Dialog ########## ########## ########## ########## ##########
//
class DesktopAppDialog extends Component {

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    handleClose = (event) => {
        this.props.DesktopAppActions.closeDialog();
    }

    handleValueChange = name => event => {
        if(event.target.type === 'checkbox') {
            this.props.DesktopAppActions.setEditingItemValue({
                name: name,
                value: (event.target.checked) ? 'allow' : 'disallow'
            });
        } else {
            this.props.DesktopAppActions.setEditingItemValue({
                name: name,
                value: event.target.value
            });
        }
    }

    handleCreateData = (event) => {
        const { DesktopAppProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '데스크톱앱 등록',
            confirmMsg: '데스크톱앱을 등록하시겠습니까?',
            handleConfirmResult: this.handleCreateConfirmResult,
            confirmObject: DesktopAppProps.get('editingItem')
        });
    }
    handleCreateConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DesktopAppProps, DesktopAppActions } = this.props;
            DesktopAppActions.createDesktopAppData(DesktopAppProps.get('editingItem'))
                .then((res) => {
                    refreshDataListInComp(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
                    this.handleClose();
                });
        }
    }

    handleEditData = (event, id) => {
        const { DesktopAppProps, GRConfirmActions } = this.props;
        GRConfirmActions.showConfirm({
            confirmTitle: '데스크톱앱 수정',
            confirmMsg: '데스크톱앱을 수정하시겠습니까?',
            handleConfirmResult: this.handleEditConfirmResult,
            confirmObject: DesktopAppProps.get('editingItem')
        });
    }
    handleEditConfirmResult = (confirmValue, paramObject) => {
        if(confirmValue) {
            const { DesktopAppProps, DesktopAppActions } = this.props;
            DesktopAppActions.editDesktopAppData(DesktopAppProps.get('editingItem'), this.props.compId)
                .then((res) => {
                    refreshDataListInComp(DesktopAppProps, DesktopAppActions.readDesktopAppListPaged);
                    this.handleClose();
                });
        }
    }

    render() {
        const { classes } = this.props;
        const bull = <span className={classes.bullet}>•</span>;

        const { DesktopAppProps } = this.props;
        const dialogType = DesktopAppProps.get('dialogType');
        const editingItem = (DesktopAppProps.get('editingItem')) ? DesktopAppProps.get('editingItem') : null;

        let title = "";
        if(dialogType === DesktopAppDialog.TYPE_ADD) {
            title = "데스크톱앱 등록";
        } else if(dialogType === DesktopAppDialog.TYPE_VIEW) {
            title = "데스크톱앱 정보";
        } else if(dialogType === DesktopAppDialog.TYPE_EDIT) {
            title = "데스크톱앱 수정";
        }

        return (
            <div>
            {(DesktopAppProps.get('dialogOpen') && editingItem) &&
            <Dialog open={DesktopAppProps.get('dialogOpen')} scroll="paper" fullWidth={true} maxWidth="sm">
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {(dialogType === DesktopAppDialog.TYPE_EDIT || dialogType === DesktopAppDialog.TYPE_ADD) &&
                    <div>
                    <TextField label="이름" className={classes.fullWidth}
                        value={(editingItem.get('appNm')) ? editingItem.get('appNm') : ''}
                        onChange={this.handleValueChange("appNm")} />
                    <TextField label="설명" className={classes.fullWidth}
                        value={(editingItem.get('appInfo')) ? editingItem.get('appInfo') : ''}
                        onChange={this.handleValueChange("appInfo")} />
                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">데스크톱앱 종류</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="application" control={
                                <Radio color="primary" value="application" onChange={this.handleValueChange("appGubun")} checked={editingItem.get('appGubun') === 'application'} />
                            } label="Application" labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="mount" control={
                                <Radio color="primary" value="mount" onChange={this.handleValueChange("appGubun")} checked={editingItem.get('appGubun') === 'mount'} />
                            } label="마운트앱" labelPlacement="end" />
                        </Grid>
                    </Grid>
                    
                    {(editingItem.get('appGubun') === 'application') && 
                    <TextField label="실행 명령어" className={classes.fullWidth}
                        value={(editingItem.get('appExec')) ? editingItem.get('appExec') : ''}
                        onChange={this.handleValueChange("appExec")} />
                    }
                    {(editingItem.get('appGubun') === 'mount') && 
                    <div>
                    <TextField label="마운트 URL" className={classes.fullWidth}
                        value={(editingItem.get('appMountUrl')) ? editingItem.get('appMountUrl') : ''}
                        onChange={this.handleValueChange("appMountUrl")} />
                    <TextField label="마운트 포인트" className={classes.fullWidth}
                        value={(editingItem.get('appMountPoint')) ? editingItem.get('appMountPoint') : ''}
                        onChange={this.handleValueChange("appMountPoint")} />
                    </div>
                    }

                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">서비스 상태</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="STAT010" control={
                                <Radio color="primary" value="STAT010" onChange={this.handleValueChange("statusCd")} checked={editingItem.get('statusCd') === 'STAT010'} />
                            } label="사용" labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="STAT020" control={
                                <Radio color="primary" value="STAT020" onChange={this.handleValueChange("statusCd")} checked={editingItem.get('statusCd') === 'STAT020'} />
                            } label="중지" labelPlacement="end" />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{marginTop:12,marginBottom:12}}>
                        <Grid xs={4} item>
                            <FormLabel component="legend">ICON 구분</FormLabel>
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="favicon" control={
                                <Radio color="primary" value="favicon" onChange={this.handleValueChange("iconGubun")} checked={editingItem.get('iconGubun') === 'favicon'} />
                            } label="Favicon 사용" labelPlacement="end" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel value="library" control={
                                <Radio color="primary" value="library" onChange={this.handleValueChange("iconGubun")} checked={editingItem.get('iconGubun') === 'library'} />
                            } label="라이브러리 사용" labelPlacement="end" />
                        </Grid>
                    </Grid>
                    {(editingItem.get('iconGubun') === 'favicon') && 
                    <TextField label="Favicon URL" className={classes.fullWidth}
                        value={(editingItem.get('iconUrl')) ? editingItem.get('iconUrl') : ''}
                        onChange={this.handleValueChange("iconUrl")} />
                    }
                    {(editingItem.get('iconGubun') === 'library') && 
                    <FormControl className={classes.fullWidth}>
                        <InputLabel htmlFor="iconNm">ICON 타입</InputLabel>
                        <Select value={(editingItem.get('iconNm')) ? editingItem.get('iconNm') : ''}
                            onChange={this.handleValueChange('iconNm')}
                            name="iconNm" style={{marginTop: 'theme.spacing.unit * 2'}}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="cloud_storage">cloud storage</MenuItem>
                            <MenuItem value="web_office">web office</MenuItem>
                            <MenuItem value="office_sns">office SNS</MenuItem>
                            <MenuItem value="team">team</MenuItem>
                            <MenuItem value="video_conferencing_system">video conferencing system</MenuItem>
                            <MenuItem value="groupware">groupware</MenuItem>
                            <MenuItem value="memo">memo</MenuItem>
                            <MenuItem value="kms">KMS</MenuItem>
                            <MenuItem value="erp">ERP</MenuItem>
                            <MenuItem value="accounting_management">accounting management</MenuItem>
                            <MenuItem value="personnel_management">personnel management</MenuItem>
                            <MenuItem value="etc_applications">etc applications</MenuItem>
                            <MenuItem value="security_status">security status</MenuItem>
                            <MenuItem value="smartcard_register">smartcard register</MenuItem>
                            <MenuItem value="gooroom_terminal_server">gooroom terminal server</MenuItem>
                            <MenuItem value="package_management">package management</MenuItem>
                            <MenuItem value="updater">updater</MenuItem>
                            <MenuItem value="archiver">archiver</MenuItem>
                            <MenuItem value="multimedia">multimedia</MenuItem>
                            <MenuItem value="calculator">calculator</MenuItem>
                            <MenuItem value="network_management">network management</MenuItem>
                            <MenuItem value="file_manager">file manager</MenuItem>
                            <MenuItem value="gooroom_browser">gooroom browser</MenuItem>
                        </Select>
                    </FormControl>
                    }
                    </div>
                }
                </DialogContent>
                <DialogActions>
                {(dialogType === DesktopAppDialog.TYPE_ADD) &&
                    <Button onClick={this.handleCreateData} variant='contained' color="secondary">등록</Button>
                }
                {(dialogType === DesktopAppDialog.TYPE_EDIT) &&
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
    DesktopAppProps: state.DesktopAppModule
});

const mapDispatchToProps = (dispatch) => ({
    DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppDialog));

