import React, { Component } from 'react';
import { Map } from 'immutable';

import { requestPostAPI, requestFilePostAPI, requestMultipartFormAPI } from 'components/GRUtils/GRRequester';
import FileSaver from 'file-saver';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import GRPane from 'containers/GRContent/GRPane';
import Grid from '@material-ui/core/Grid';
import { formatDateToSimple } from 'components/GRUtils/GRDates';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GetApp from '@material-ui/icons/GetApp'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";
import moment, { now } from 'moment';

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
    const { t } = this.props;
    const selectedFile = event.target.files[0];
    const viewFileName = gubunName + '_GRFILE';
    
    if(!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) { //file format ch
      this.props.GRAlertActions.showAlert({
        alertTitle: t("dtSystemError"),
        alertMsg: t("msgFileFormatError")
      });
    } else {
      this.readDeptFileContent(event.target.files[0]).then(content => {
        if(content) {
          const { stateData } = this.state;
          this.setState({
            stateData: stateData.set('deptSelectedFile', selectedFile).set('deptFileContent', content)
          });
        }
    }).catch(error => console.log(error));
    }
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
                      alertMsg: t("msgEditErrorSaveDeptDataFromFile"),
                      alertMsgDetail: "(" + response.data.status.message + ")"
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

  // https://stackoverflow.com/questions/43460162/react-excel-file-download-corrupt
  // https://blog.bitsrc.io/exporting-data-to-excel-with-react-6943d7775a92
  handleDownloadDeptData = (event) => {
    requestFilePostAPI('createDeptFileFromData', {}).then(
      (response) => {
        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        FileSaver.saveAs(blob, 'DEPT_gooroom_'+ formatDateToSimple(new Date(), 'YY/MM/DD') + '.xlsx');
      }
    )
  }

  handleDownloadSampleDeptData = (event) => {
    requestFilePostAPI('createDeptSampleFileFromData', {}).then(
      (response) => {
        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        FileSaver.saveAs(blob, 'DEPT_SAMPLE_gooroom_'+ formatDateToSimple(new Date(), 'YY/MM/DD') + '.xlsx');
      }
    )
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
                      alertMsg: t("msgEditErrorSaveUserDataFromFile"),
                      alertMsgDetail: "(" + response.data.status.message + ")"
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

  handleDownloadUserData = (event) => {
    requestFilePostAPI('createUserFileFromData', {}).then(
      (response) => {
        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        FileSaver.saveAs(blob, 'USER_gooroom_'+ formatDateToSimple(new Date(), 'YY/MM/DD') + '.xlsx');
      }
    )
  }

  handleDownloadSampleUserData = (event) => {
    requestFilePostAPI('createUserSampleFileFromData', {}).then(
      (response) => {
        var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        FileSaver.saveAs(blob, 'USER_SAMPLE_gooroom_'+ formatDateToSimple(new Date(), 'YY/MM/DD') + '.xlsx');
      }
    )
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
                title={<div>
                  <Typography variant="h5" style={{marginRight:10}}>{t("lbSaveDeptDataFromFile")}</Typography>
                  <Button className={classes.GRIconSmallButton} variant='contained' color="secondary" style={{marginRight:10}} onClick={this.handleDownloadDeptData}>
                    <GetApp /> {t("dtViewDept")} {t("btnDownload")}
                  </Button>
                  <Button className={classes.GRIconSmallButton} variant='contained' color="secondary" style={{marginRight:10}} onClick={this.handleDownloadSampleDeptData}>
                    <GetApp /> {t("dtViewDept")} {t("lbSample")} {t("btnDownload")}
                  </Button>
                </div>}
                subheader={<div style={{margin:20}}>
                <Typography variant="body1">{t("msgDeptFromFileHelp01")}</Typography>
                <Typography variant="body1">{t("msgDeptFromFileHelp02")}</Typography>
                <Typography variant="body1">{t("msgDeptFromFileHelp03")}</Typography>
                <Typography variant="body1">{t("msgDeptFromFileHelp04")}</Typography>
                <Typography variant="body1" style={{fontWeight:'bold'}}>{t("msgDeptFromFileHelp05")}</Typography>
                <Typography variant="body1" style={{color:'red'}}>{t("msgDeptFromFileHelp06")}</Typography>
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
                title={<div>
                  <Typography variant="h5" style={{marginRight:10}}>{t("lbSaveUserDataFromFile")}</Typography>
                  <Button className={classes.GRIconSmallButton} variant='contained' color="secondary" style={{marginRight:10}} onClick={this.handleDownloadUserData}>
                    <GetApp /> {t("dtViewUser")} {t("btnDownload")}
                  </Button>
                  <Button className={classes.GRIconSmallButton} variant='contained' color="secondary" style={{marginRight:10}}onClick={this.handleDownloadSampleUserData}>
                    <GetApp /> {t("dtViewUser")} {t("lbSample")} {t("btnDownload")}
                  </Button>
                </div>}
                subheader={<div style={{margin:20}}>
                  <Typography variant="body1">{t("msgUserFromFileHelp01")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp02")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp03")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp04")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp05")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp06")}</Typography>
                  <Typography variant="body1">{t("msgUserFromFileHelp07")}</Typography>
                  <Typography variant="body1" style={{color:'red'}}>{t("msgUserFromFileHelp08")}</Typography>
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

