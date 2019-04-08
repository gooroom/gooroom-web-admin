import React, { Component } from 'react';
import { Map } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { requestPostAPI, requestMultipartFormAPI } from 'components/GRUtils/GRRequester';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import GRPane from 'containers/GRContent/GRPane';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropItemIcon from '@material-ui/icons/RadioButtonChecked';

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

  componentDidMount() {
    this.getSeverUrlInfo();
  }

  getSeverUrlInfo = () => {
    requestPostAPI('readCurrentMgServerConf', {}).then(
      (response) => {
        const { data } = response.data;
        if(data && data.length > 0) {
          
          let pwRule = null;
          if(data[0].passwordRule) {
            pwRule = JSON.parse(data[0].passwordRule);
          }

          let dupValue = 0;
          if(data[0].enableDuplicateLogin) {
            dupValue = Math.abs(data[0].enableDuplicateLogin);
          }

          this.setState(({stateData}) => ({
            stateData: stateData.set('gpmsDomain', data[0].pmUrl)
            .set('glmDomain', data[0].lmUrl)
            .set('grmDomain', data[0].rmUrl)
            .set('pollingTime', data[0].pollingTime)
            .set('trialCount', data[0].trialCount)
            .set('lockTime', data[0].lockTime)            
            .set('passwordRule', data[0].passwordRule)
            .set('pwMinLength', pwRule ? pwRule.minlen : '8')
            .set('pwIncludeNumber', pwRule ? pwRule.dcredit : false)
            .set('pwIncludeUpper', pwRule ? pwRule.ucredit : false)
            .set('pwIncludeLower', pwRule ? pwRule.lcredit : false)
            .set('pwIncludeSpecial', pwRule ? pwRule.ocredit : false)
            .set('pwDiffBefore', pwRule ? pwRule.difok : '0')
            .set('enableDuplicateLogin', (data[0].enableDuplicateLogin > 0) ? true : false)
            .set('duplicateLoginNotiType', dupValue.toString())
          }));
        }
    });
  };

  handleValueChange = name => event => {
    const { stateData } = this.state;
    const value = (event.target.type === 'checkbox') ? event.target.checked : event.target.value;
    this.setState({
      stateData: stateData.set(name, value)
    });
  }

  handlePwRuleChange = name => event => {
    const { stateData } = this.state;
    this.setState({
      stateData: stateData.set(name, event.target.value)
    });
  }

  handlePwIncludeRuleChange = name => event => {
    const { stateData } = this.state;
    this.setState({
      stateData: (event.target.checked) ? stateData.set(name, "-1") : stateData.set(name, "0")
    });
  }

  checkInclude = value => {
    return (value == '-1');
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

          // console.log('selectedFile :::: ', selectedFile);
          // console.log('content :::: ', content);

            // this.props.ThemeManageActions.setEditingItemObject({
            //     [gubunName]: selectedFile,
            //     [viewFileName]: content
            // });
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
    
    GRConfirmActions.showConfirm({
        confirmTitle: t("lbSaveServerConfig"),
        confirmMsg: t("msgSaveServerConfig"),
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
                      alertMsg: t("msgEditOkServerConfig")
                    });
                    this.getSeverUrlInfo();
                  } else {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemError"),
                      alertMsg: t("msgEditErrorServerConfig")
                    });
                    this.getSeverUrlInfo();
                  }
                }
              );
          } else {
            this.getSeverUrlInfo();
          }
        }
    });
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
    
    GRConfirmActions.showConfirm({
        confirmTitle: t("lbSaveServerConfig"),
        confirmMsg: t("msgSaveServerConfig"),
        handleConfirmResult: (confirmValue) => {
          const { t } = this.props;
          if(confirmValue) {
              const { stateData } = this.state;
              requestMultipartFormAPI('createUserDataFromFile', {
                userSelectedFile: stateData.get('userSelectedFile'),
                userFileContent: stateData.get('userFileContent')
              }).then(
                (response) => {
                  if(response && response.data && response.data.status && response.data.status.result === 'success') {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtEditOK"),
                      alertMsg: t("msgEditOkServerConfig")
                    });
                    this.getSeverUrlInfo();
                  } else {
                    this.props.GRAlertActions.showAlert({
                      alertTitle: t("dtSystemError"),
                      alertMsg: t("msgEditErrorServerConfig")
                    });
                    this.getSeverUrlInfo();
                  }
                }
              );
          } else {
            this.getSeverUrlInfo();
          }
        }
    });
  }
  

  render() {
    const { classes } = this.props;
    const { stateData } = this.state;
    const { t } = this.props;

    const deptHelp1 = <React.Fragment><Typography variant="subtitle2">{t("조직정보를 파일을 이용하여 등록할 수 있습니다.!!!")}</Typography><Typography variant="subtitle2">{t("조직정보를 파일을 이용하여 등록할 수 있습니다.???")}</Typography></React.Fragment>;
    const userHelp1 = <React.Fragment><Typography variant="subtitle2">{t("사용자정보를 파일을 이용하여 등록할 수 있습니다.!!!")}</Typography><Typography variant="subtitle2">{t("사용자정보를 파일을 이용하여 등록할 수 있습니다.???")}</Typography></React.Fragment>;

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
          <Grid item xs={6}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("조직정보 일괄등록")}
                subheader={deptHelp1}
              />
              <CardContent style={{paddingTop: 0}}>
                <Grid container spacing={24}>
                  <Grid item xs={8}>
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
          <Grid item xs={6}>
          </Grid>
        </Grid>

        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("사용자정보 일괄등록")}
                subheader={userHelp1}
              />
              <CardContent style={{paddingTop: 0}}>
                <Grid container spacing={24}>
                  <Grid item xs={8}>
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
          <Grid item xs={6}>
          </Grid>
        </Grid>

        </GRPane>
        <GRConfirm />
        <GRAlert />
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

