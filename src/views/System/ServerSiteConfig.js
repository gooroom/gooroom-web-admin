import React, { Component } from 'react';
import { Map } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { requestPostAPI } from 'components/GRUtils/GRRequester';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRConfirm from 'components/GRComponents/GRConfirm';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import GRPane from 'containers/GRContent/GRPane';
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

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
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropItemIcon from '@material-ui/icons/RadioButtonChecked';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class ServerSiteConfig extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        gpmsDomain: '',
        glmDomain: '',
        grmDomain: '',
        pollingTime: '',
        trialCount: '',
        lockTime: '',
        passwordRule: '',
        pwMinLength: '',
        pwIncludeNumber: false,
        pwIncludeUpper: false,
        pwIncludeLower: false,
        pwIncludeSpecial: false,
        enableDuplicateLogin: false,
        duplicateLoginNotiType: '1'
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

          if(dupValue === 0) {
            dupValue = 1;
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
            .set('enableDuplicateLogin', (data[0].enableDuplicateLogin > 0) ? true : false)
            .set('duplicateLoginNotiType', dupValue.toString())
          }));
        }
    });
  };


  handleSaveData = (event) => {
    const { GRConfirmActions } = this.props;
    const { t } = this.props;

    if(this.refs.form && this.refs.form.isFormValid()) {
    
      GRConfirmActions.showConfirm({
          confirmTitle: t("lbSaveServerConfig"),
          confirmMsg: t("msgSaveServerConfig"),
          handleConfirmResult: (confirmValue) => {
            const { t } = this.props;
            if(confirmValue) {
                const { stateData } = this.state;
                // create password rule to json format
                const newPasswordRule = JSON.stringify({
                  "minlen": stateData.get('pwMinLength'), 
                  "dcredit": stateData.get('pwIncludeNumber'), 
                  "ucredit": stateData.get('pwIncludeUpper'), 
                  "lcredit": stateData.get('pwIncludeLower'), 
                  "ocredit": stateData.get('pwIncludeSpecial')
                });

                const dupValue = (stateData.get('enableDuplicateLogin')) ? stateData.get('duplicateLoginNotiType') : stateData.get('duplicateLoginNotiType') * -1;
                
                requestPostAPI('createMgServerConf', {
                  pmUrl: stateData.get('gpmsDomain'),
                  lmUrl: stateData.get('glmDomain'),
                  rmUrl: stateData.get('grmDomain'),
                  pollingTime: stateData.get('pollingTime'),
                  trialCount: stateData.get('trialCount'),
                  lockTime: stateData.get('lockTime'),
                  passwordRule: newPasswordRule,
                  enableDuplicateLogin: dupValue
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

    } else {
      if(this.refs.form && this.refs.form.childs) {
          this.refs.form.childs.map(c => {
              this.refs.form.validate(c);
          });
      }
    }
  }

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

  render() {
    const { stateData } = this.state;
    const { t } = this.props;

    const tempArray = new Array(13).fill(0);
    const minLength = 8;

    const subLogin = <div>
      <Typography variant="body2" gutterBottom>{t("msgLoginTrialCountAndLockTime")}</Typography>
      <Typography variant="body2" gutterBottom>{t("msgLoginLockTime")}</Typography>
      </div>;

    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
        <ValidatorForm ref="form">
        <AppBar position="static" elevation={0} color="default">
          <Toolbar variant="dense">
            <div style={{flexGrow: 1}} />
            <Button onClick={this.handleSaveData} size="small" variant='contained' color="primary">{t("btnSave")}</Button>
          </Toolbar>
        </AppBar>

        <Card style={{marginTop: 16}}>
          <CardHeader style={{paddingBottom: 0}}
            title={t("lbServerInfo")} subheader="domain"
          />
          <CardContent style={{paddingTop: 0}}>
            <TextField label="GPMS"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('gpmsDomain')}
              onChange={this.handleValueChange("gpmsDomain")}
            />
            <TextField label="GLM"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('glmDomain')}
              onChange={this.handleValueChange("glmDomain")}
            />
            <TextField label="GRM"
              style={{ marginLeft: 8 }}
              margin="normal"
              variant="outlined"
              value={stateData.get('grmDomain')}
              onChange={this.handleValueChange("grmDomain")}
            />
          </CardContent>
        </Card>

        <Grid container spacing={24}>
          <Grid item xs={6}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbAgentPollingTime")}
                subheader={t("msgAgentPollingTime")}
              />
              <CardContent style={{paddingBottom: 20}}>
                <TextValidator label="Polling Seconds"
                  name="pollingSecond"
                  validators={['required', 'matchRegexp:^[0-9]+$']}
                  errorMessages={[t("msgTypeNumberOnly")]}
                  variant="outlined"
                  value={stateData.get('pollingTime')}
                  onChange={this.handleValueChange("pollingTime")}
                />
              </CardContent>
            </Card>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbPasswordRule")}
                subheader={t("msgPasswordRule")}
              />
              <CardContent style={{paddingTop: 0}}>
                <List dense={true} style={{maxWidth:440,borderStyle:'solid',borderWidth:1,borderRadius:4,borderColor:'#0000003b',margin:10,padding:10}}>
                  <ListItem >
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbPwMinLength")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                    <Select value={stateData.get('pwMinLength')}
                      onChange={this.handlePwRuleChange('pwMinLength')}
                    >
                      {tempArray.map((n, i) => (
                        <MenuItem key={i} value={minLength+i}>{minLength+i}</MenuItem>
                      ))}
                    </Select>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbPwIncludeNumber")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                      <FormControlLabel style={{heigth:32}}
                          control={<Switch onChange={this.handlePwIncludeRuleChange('pwIncludeNumber')} 
                              checked={this.checkInclude(stateData.get('pwIncludeNumber'))}
                              color="primary" />}
                          label={(stateData.get('pwIncludeNumber') === '-1') ? t("selHasInclude") : t("selHasNoInclude")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbPwIncludeUpper")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                      <FormControlLabel style={{heigth:32}}
                        control={<Switch onChange={this.handlePwIncludeRuleChange('pwIncludeUpper')} 
                            checked={this.checkInclude(stateData.get('pwIncludeUpper'))}
                            color="primary" />}
                        label={(stateData.get('pwIncludeUpper') === '-1') ? t("selHasInclude") : t("selHasNoInclude")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbPwIncludeLower")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                      <FormControlLabel style={{heigth:32}}
                        control={<Switch onChange={this.handlePwIncludeRuleChange('pwIncludeLower')} 
                            checked={this.checkInclude(stateData.get('pwIncludeLower'))}
                            color="primary" />}
                        label={(stateData.get('pwIncludeLower') === '-1') ? t("selHasInclude") : t("selHasNoInclude")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbPwIncludeSpecial")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                      <FormControlLabel style={{heigth:32}}
                        control={<Switch onChange={this.handlePwIncludeRuleChange('pwIncludeSpecial')} 
                            checked={this.checkInclude(stateData.get('pwIncludeSpecial'))}
                            color="primary" />}
                        label={(stateData.get('pwIncludeSpecial') === '-1') ? t("selHasInclude") : t("selHasNoInclude")}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbLoginTrialCount")}
                subheader={subLogin}
              />
              <CardContent style={{paddingBottom: 20}}>
                <TextValidator label="Login Trial Count" 
                  name="trialCount" style={{ marginLeft: 8 }}
                  validators={['required', 'matchRegexp:^[0-9]+$']}
                  errorMessages={[t("msgTypeNumberOnly")]}
                  variant="outlined"
                  value={stateData.get('trialCount')}
                  onChange={this.handleValueChange("trialCount")}
                />
                <TextValidator label="Account lockout time"
                  name="lockoutTime" style={{ marginLeft:8,width:223 }}
                  validators={['required', 'matchRegexp:^[0-9]+$']}
                  errorMessages={[t("msgTypeNumberOnly")]}
                  variant="outlined"
                  InputProps={{
                    endAdornment: <InputAdornment position="start">Minutes</InputAdornment>,
                  }}
                  value={stateData.get('lockTime')}
                  onChange={this.handleValueChange("lockTime")}
                />
              </CardContent>
            </Card>
            <Card style={{marginTop: 16}}>
              <CardHeader style={{paddingBottom: 0}}
                title={t("lbLoginDuplicatgeEnable")}
                subheader={t("msgLoginDuplicatgeEnable")}
              />
              <CardContent style={{paddingTop: 0}}>

                <List dense={true} style={{maxWidth:440,borderStyle:'solid',borderWidth:1,borderRadius:4,borderColor:'#0000003b',margin:10,padding:10}}>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbSelectLoginDuplicatgeEnable")} style={{padding:0}} />
                    <ListItemSecondaryAction>
                    <FormControlLabel style={{heigth:32}}
                        control={<Switch onChange={this.handleValueChange('enableDuplicateLogin')} 
                            checked={stateData.get('enableDuplicateLogin')}
                            color="primary" />}
                        label={(stateData.get('enableDuplicateLogin')) ? t("selPermitRule") : t("selNoPermitRule")}
                    />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PropItemIcon style={{width:'16px'}} /></ListItemIcon>
                    <ListItemText primary={t("lbLoginDuplicatgeNotiType")} style={{padding:0}} />
                  </ListItem>
                  <ListItem style={{marginTop:10}}>
                    <ListItemSecondaryAction>
                      <RadioGroup row aria-label="dup-radio" name="dup"
                        value={stateData.get('duplicateLoginNotiType')} onChange={this.handleValueChange('duplicateLoginNotiType')}
                      >
                        <FormControlLabel value="1"
                          control={<Radio color="primary" />}
                          label={t("lbLoginDuplicatgeNotiType0")} labelPlacement="end"
                        />
                        <FormControlLabel value="2"
                          control={<Radio color="primary" />}
                          label={t("lbLoginDuplicatgeNotiType1")} labelPlacement="end"
                        />
                        <FormControlLabel value="3"
                          control={<Radio color="primary" />}
                          label={t("lbLoginDuplicatgeNotiType2")} labelPlacement="end"
                        />
                        <FormControlLabel value='4'
                          control={<Radio color="primary" />}
                          label={t("lbLoginDuplicatgeNotiType3")} labelPlacement="end"
                        />
                      </RadioGroup>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        </ValidatorForm>
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

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ServerSiteConfig)));

