

import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as NoticePublishActions from 'modules/NoticePublishModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import FolderIcon from "@material-ui/icons/Folder";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from '@material-ui/core/Checkbox';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class NoticePublishTargetViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { editingItem, t } = this.props;

        const selectedDept = (editingItem && editingItem.get('deptInfoList')) ? editingItem.get('deptInfoList') : null;
        const selectedUser = (editingItem && editingItem.get('userInfoList')) ? editingItem.get('userInfoList') : null;

        const selectedGroup = (editingItem && editingItem.get('grpInfoList')) ? editingItem.get('grpInfoList') : null;
        const selectedClient = (editingItem && editingItem.get('clientInfoList')) ? editingItem.get('clientInfoList') : null;

        return (
            <div style={{marginTop: 10}} >
            {
            <React.Fragment>
                <Grid container spacing={0}>
                    <Grid item xs={6} style={{padding:0,marginBottom:0,border:'1px solid lightgray'}}>
                        <Typography variant="subtitle2">{t('lbClientGroup')}</Typography>
                        <div style={{padding:0,height:150,overflowY:'auto'}}>
                            <List >
                            {selectedGroup && selectedGroup.map((n) => (
                                <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                    <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                    <ListItemText primary={n.get('name')} />
                                    <ListItemSecondaryAction>
                                        <Checkbox color="primary" disableRipple
                                            checked={(n.get('isCheck')) ? n.get('isCheck') : false}
                                            disabled={true}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{padding:0,marginBottom:0,border:'1px solid lightgray'}}>
                        <Typography variant="subtitle2">{t('lbClient')}</Typography>
                        <div style={{padding:0,height:150,overflowY:'auto'}}>
                            <List >
                            {selectedClient && selectedClient.map((n) => (
                                <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                    <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                    <ListItemText primary={n.get('name')} />
                                </ListItem>
                            ))}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{padding:0,marginBottom:0,border:'1px solid lightgray'}}>
                        <Typography variant="subtitle2">{t('lbDepartment')}</Typography>
                        <div style={{padding:0,height:150,overflowY:'auto'}}>
                            <List >
                            {selectedDept && selectedDept.map((n) => (
                                <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                    <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                    <ListItemText primary={n.get('name')} />
                                </ListItem>
                            ))}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{padding:0,marginBottom:0,border:'1px solid lightgray'}}>
                        <Typography variant="subtitle2">{t('lbUser')}</Typography>
                        <div style={{padding:0,height:150,overflowY:'auto'}}>
                        <List >
                            {selectedUser && selectedUser.map((n) => (
                                <ListItem key={n.get('value')} style={{padding:'2px 32px 2px 32px'}}>
                                    <ListItemIcon style={{marginRight:0}}><FolderIcon fontSize='small'/></ListItemIcon>
                                    <ListItemText primary={n.get('name')} />
                                </ListItem>
                            ))}
                        </List>
                        </div>
                    </Grid>
                </Grid>
            </React.Fragment>
            }
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    NoticePublishProps: state.NoticePublishModule
});

const mapDispatchToProps = (dispatch) => ({
    NoticePublishActions: bindActionCreators(NoticePublishActions, dispatch),
    GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(NoticePublishTargetViewer)));