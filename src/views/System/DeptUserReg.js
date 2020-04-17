import React, { Component } from 'react';
import { Map } from 'immutable';

import { requestPostAPI, requestMultipartFormAPI } from 'components/GRUtils/GRRequester';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRPane from 'containers/GRContent/GRPane';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class DeptUserReg extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        deptSelectedFile: null,
        deptFileContent: null,
        userSelectedFile: null,
        userFileContent: null
      })
    };
  }

  // file select
  handleDeptFileChange = (event, gubunName) => {
    const selectedFile = event.target.files[0];
    const viewFileName = gubunName + '_GRFILE';
    this.readDeptFileContent(event.target.files[0]).then(content => {
        if(content) {
          const { stateData } = this.state;
          this.setState({
            stateData: stateData.set('deptSelectedFile', selectedFile).set('deptFileContent', content)
          });
        }
    }).catch(error => console.log(error));
  }

  readDeptFileContent(file) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
          reader.onload = event => resolve(event.target.result)
          reader.onerror = error => reject(error)
          reader.readAsDataURL(file)
      });
  }

  handleDeptSaveData = (event) => {
    const { GRConfirmActions } = this.props;
    const { t } = this.props;
    const { stateData } = this.state;

    if(stateData.get('deptSelectedFile') !== null) {
      GRConfirmActions.showConfirm({
        confirmTitle: t("lbSaveDeptDataFromFile"),
        confirmMsg: t("msgSaveDeptDataFromFile"),
        handleConfirmResult: (confirmValue) => {
          const { t } = this.props;
          if(confirmValue) {
              const { stateData } = this.state;
              requestMultipartFormAPI('createDeptDataFromFile', {
                deptSelectedFile: stateData.get('deptSelectedFile'),
                deptFileContent: stateData.get('deptFileContent')
              }).then(
                (response) => {
                  if(response && response.data && response.data.status && response.data.status.result === 'success') {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtEditOK"),
                      alertMsg: t("msgEditOkSaveDeptDataFromFile")
                    });
                  } else {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemError"),
                      alertMsg: t("msgEditErrorSaveDeptDataFromFile")
                    });
                  }
                }
              );
          } else {
          }
        }
      });
    } else {
      this.props.GRAlertActions.showAlert({
        alertTitle: this.props.t("dtSystemError"),
        alertMsg: this.props.t("msgMustHaveSelectedFile")
      });
    }
  }


  // file select
  handleUserFileChange = (event, gubunName) => {
    const selectedFile = event.target.files[0];
    this.readUserFileContent(event.target.files[0]).then(content => {
        if(content) {
          const { stateData } = this.state;
          this.setState({
            stateData: stateData.set('userSelectedFile', selectedFile).set('userFileContent', content)
          });
        }
    }).catch(error => console.log(error));
  }
  
  readUserFileContent(file) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
          reader.onload = event => resolve(event.target.result)
          reader.onerror = error => reject(error)
          reader.readAsDataURL(file)
      });
  }

  handleUserSaveData = (event) => {
    const { GRConfirmActions } = this.props;
    const { t } = this.props;
    const { stateData } = this.state;

    if(stateData.get('userSelectedFile') !== null) {
      GRConfirmActions.showConfirm({
        confirmTitle: t("lbSaveUserDataFromFile"),
        confirmMsg: t("msgSaveUserDataFromFile"),
        handleConfirmResult: (confirmValue) => {
          const { t } = this.props;
          if(confirmValue) {
              requestMultipartFormAPI('createUserDataFromFile', {
                userSelectedFile: stateData.get('userSelectedFile'),
                userFileContent: stateData.get('userFileContent')
              }).then(
                (response) => {
                  if(response && response.data && response.data.status && response.data.status.result === 'success') {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtEditOK"),
                      alertMsg: t("msgEditOkSaveUserDataFromFile")
                    });
                  } else {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemError"),
                      alertMsg: t("msgEditErrorSaveUserDataFromFile")
                    });
                  }
                }
              );
          }
        }
      });
    } else {
      this.props.GRAlertActions.showAlert({
        alertTitle: this.props.t("dtSystemError"),
        alertMsg: this.props.t("msgMustHaveSelectedFile")
      });
    }

  }
  

  render() {
    const { classes } = this.props;
    const { t } = this.props;

    const deptFile = this.state.stateData.get('deptSelectedFile');
    const userFile = this.state.stateData.get('userSelectedFile');

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>

        <AppBar position="static" elevation={0} color="default">
          <Toolbar variant="dense">
            <div style={{flexGrow: 1}} />
            
          </Toolbar>
        </AppBar>

        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbSaveDeptDataFromFile")}
                subheader={<div style={{margin:20}}>
                <Typography variant="body1">{t("msgDeptFromFileHelp01")}</Typography>
                <Typography variant="body1">{t("msgDeptFromFileHelp02")}</Typography>
                <Typography variant="body1">{t("msgDeptFromFileHelp03")}</Typography>
                  <Typography variant="body1" style={{fontWeight:'bold'}}>{t("msgDeptFromFileHelp04")}</Typography>
                  <Typography variant="body1" style={{fontWeight:'bold'}}>{t("msgDeptFromFileHelp05")}</Typography>
                  <Typography variant="body1" style={{fontWeight:'bold'}}>{t("msgDeptFromFileHelp06")}</Typography>
                  <Typography variant="body1" style={{color:'red'}}>{t("msgDeptFromFileHelp07")}</Typography>
                </div>}
              />
              <CardContent style={{paddingTop: 0}}>
                <Grid container spacing={24}>
                  <Grid item xs={4} style={{textAlign:'right'}}>
                    <Typography>{(deptFile) ? deptFile.name : ''}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <input style={{display:'none'}} id={'dept-file'} type="file" onChange={event => this.handleDeptFileChange(event, 'deptFile')} />
                    <label htmlFor={'dept-file'}>
                      <Button variant="contained" size='small' component="span" className={classes.button}>{t("btnSelectFile")}</Button>
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <Button onClick={this.handleDeptSaveData} size="small" variant='contained' color="primary">{t("btnSave")}</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbSaveUserDataFromFile")}
                subheader={<div style={{margin:20}}>
                  <Typography variant="body1">{t("msgUserFromFileHelp01")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp02")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp03")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp04")}</Typography>
                  <Typography variant="body1" style={{color:'red'}}>{t("msgUserFromFileHelp05")}</Typography>
                </div>}
              />
              <CardContent style={{paddingTop: 0}}>
                <Grid container spacing={24}>
                  <Grid item xs={4} style={{textAlign:'right'}}>
                    <Typography>{(userFile) ? userFile.name : ''}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <input style={{display:'none'}} id={'user-file'} type="file" onChange={event => this.handleUserFileChange(event, 'userFile')} />
                    <label htmlFor={'user-file'}>
                      <Button variant="contained" size='small' component="span" className={classes.button}>{t("btnSelectFile")}</Button>
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <Button onClick={this.handleUserSaveData} size="small" variant='contained' color="primary">{t("btnSave")}</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        </GRPane>
        <GRConfirm />
        {/*<GRAlert /> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptUserReg)));

