import React, { Component } from "react";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AdminUserActions from 'modules/AdminUserModule';

import GRRuleCardHeader from 'components/GRComponents/GRRuleCardHeader';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DividedAdminManageSpec extends Component {

  render() {

    const { classes, selectedItem, compId } = this.props;
    const { AdminUserProps } = this.props;
    const { t, i18n } = this.props;

    return (
      <React.Fragment>
      {selectedItem &&
        <Card elevation={4} className={classes.ruleViewerCard}>
          <GRRuleCardHeader
            category={t('lbAdminSpecifiedRole')} title={selectedItem.get('adminNm')} 
            subheader={selectedItem.get('adminId')}
            action={<div style={{paddingTop:16,paddingRight:24}}>
                <Button size="small" variant="outlined" color="primary" style={{minWidth:32}}
                  onClick={(event) => this.props.onClickEdit(event, selectedItem.get('adminId'))}
                ><EditIcon /></Button>
              </div>}
          />
          <CardContent style={{padding:10,width:'100%'}}>
            <Grid container spacing={0}>
            </Grid>
            <Grid container spacing={0}>
            </Grid>
            <Grid container spacing={0}>
              {(selectedItem.get('connIps') && selectedItem.get('connIps').size > 0) &&
              <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16}}>{`[ ${t('lbConnectableIp')} ]`}</Grid>
              }
              {(selectedItem.get('connIps')) && selectedItem.get('connIps').map((n, i) => (
                <React.Fragment key={n}>
                  <Grid item xs={3} className={classes.specTitle}>{`( ${(i + 1)} ) ${t('lbIp')}`}</Grid>
                  <Grid item xs={3} className={classes.specContent}>{n}</Grid>
                </React.Fragment>
              ))}
              {(selectedItem.get('connIps') == null || selectedItem.get('connIps').size < 1) &&
                <Grid item xs={12} className={classes.specCategory} style={{paddingTop:16,color:'lightGray'}}>[ <strike>{`[ ${t('lbConnectableIp')} ]`}</strike> ]</Grid>
              }
            </Grid>
          </CardContent>
        </Card>
      }
      </React.Fragment>
    );

  }
}

const mapStateToProps = (state) => ({
  AdminUserProps: state.AdminUserModule
});

const mapDispatchToProps = (dispatch) => ({
  AdminUserActions: bindActionCreators(AdminUserActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DividedAdminManageSpec)));
