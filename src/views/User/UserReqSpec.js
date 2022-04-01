import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as UserReqActions from 'modules/UserReqModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import UserIcon from '@material-ui/icons/Person';

import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";


class UserReqSpec extends Component {

  handleDeleteUserReq = (event, reqSeq) => {
    const { t, i18n } = this.props;
    const { compId } = this.props;
    this.props.GRConfirmActions.showConfirm({
      confirmTitle: t("btUsbAuthRecovery"),
      confirmMsg: t("msgUnregister", {reqSeq: reqSeq}),
      handleConfirmResult: (confirmValue, paramObject) => {
        if(confirmValue) {
          const { UserReqActions, UserReqProps } = this.props;
          UserReqActions.revokeUserReq({
            compId: compId,
            reqSeq: reqSeq
          }).then((res) => {
            if(res.status && res.status && res.status.result === 'fail' && res.status.message) {
              this.props.GRAlertActions.showAlert({
                alertTitle: t("dtSystemNotice"),
                alertMsg: res.status.message
              });
            }

            if(res.status && res.status && res.status.result === 'success') {
              UserReqActions.closeInform({ compId: compId });
              UserReqActions.readUserReqListPaged(UserReqProps, compId, {page: 0});
            }
          });
        }
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { UserReqProps, compId, isEditable } = this.props;
    const { t, i18n } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const informOpen = UserReqProps.getIn(['viewItems', compId, 'informOpen']);
    const viewItem = UserReqProps.getIn(['viewItems', compId, 'viewItem']);
    
    return (
      <React.Fragment>
        {(informOpen && viewItem) && 
          <Card elevation={4} className={classes.ruleViewerCard}>
            <GRRuleCardHeader avatar={<Avatar aria-label="Recipe" style={{ backgroundColor: orange[400] }}><UserIcon /></Avatar>}
              category={t("lbUserMediaRuleReqDetail")} title={viewItem.get('userId')} 
              subheader={'Requset Seq : ' + viewItem.get('reqSeq') + ', ' + viewItem.get('userId')}
              action={(viewItem.get('adminCheck') !== 'waiting' 
                  && (viewItem.get('adminCheck') === 'register-approval' || viewItem.get('adminCheck') === 'unregister-deny') 
                  && viewItem.get('status') !== 'revoke') ?
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="medium" variant="contained" style={{minWidth:32, backgroundColor: red[500]}}
                    onClick={(e) => this.handleDeleteUserReq(e, viewItem.get('reqSeq'))}
                  >
                    {t('btUsbAuthRecovery')}
                  </Button>
                </div> : <div></div>
              }
            />

            <CardContent style={{padding: 10}}>
              <Grid container spacing={0}>
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("colUsbName")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('usbName')}</Grid>
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUsbSerial")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('usbSerialNo')}</Grid>

                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUsbProduct")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('usbProduct')}</Grid>
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUsbVendor")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('usbVendor')}</Grid>
                
                <Grid item xs={4} className={classes.specTitle}>{bull} {t("lbUsbModel")}</Grid>
                <Grid item xs={2} className={classes.specContent}>{viewItem.get('usbModel')}</Grid>
              </Grid>
            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  UserReqProps: state.UserReqModule,
  AdminProps: state.AdminModule
});

const mapDispatchToProps = (dispatch) => ({
  UserReqActions: bindActionCreators(UserReqActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(UserReqSpec)));
