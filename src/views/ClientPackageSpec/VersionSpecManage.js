import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GlobalActions from 'modules/GlobalModule';
import * as GRAlertActions from 'modules/GRAlertModule';
import * as ClientPackageActions from 'modules/ClientPackageModule';
import * as ClientPackageSpecActions from 'modules/ClientPackageSpecModule';
import * as ClientPackageVersionActions from 'modules/ClientPackageVersionModule';

import GRPageHeader from 'containers/GRContent/GRPageHeader';
import GRPane from 'containers/GRContent/GRPane';

import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import PackageCompWithVersion from './PackageCompWithVersion';
import VersionListComp from './VersionListComp';
import ClientPackageVersionComp from './ClientPackageVersionComp';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate } from "react-i18next";

class VersionSpecManage extends Component {
  constructor(props) {
    super(props);
  }

  // Select Version Item
  handleVersionSelect = (selectedVerObj) => {
    const { ClientPackageSpecActions, ClientPackageVersionActions, ClientPackageSpecProps } = this.props;
    const compId = this.props.match.params.grMenuId;

    // 선택된 버전 객체가 없을 경우 예외 처리
    if (!selectedVerObj) {
      console.error("선택된 버전 객체가 없습니다.");
      return;
    }

    // isoVer가 존재하지 않을 경우 예외 처리
    const isoVer = selectedVerObj.get ? selectedVerObj.get('isoVer') : selectedVerObj.isoVer;
    if (!isoVer) {
      console.error("isoVer 속성이 존재하지 않습니다.");
      return;
    }

    // show version information
    ClientPackageVersionActions.showPackageVersion({ compId: compId, viewItem: selectedVerObj });
    // show version info.
    if (selectedVerObj) {
      ClientPackageSpecActions.readpackageSpecListPagedInVersion(ClientPackageSpecProps, compId, {
        version: isoVer,
        page: 0
      });
    }
  };

  isVersionChecked = () => {
    const checkedIds = this.props.ClientPackageVersionProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    // checkedIds가 정의되지 않았거나 null일 경우 안전하게 처리
    if (!checkedIds) {
      console.log("checkedIds가 정의되지 않았습니다.");
      return false;
    }

    if (Array.isArray(checkedIds)) {
      return checkedIds.length === 2;
    } else if (checkedIds.size !== undefined) {
      return checkedIds.size === 2;
    } else {
      return false;
    }
  }

  handleCompareClick = () => {
    const { ClientPackageActions, ClientPackageProps } = this.props;
    const compId = this.props.match.params.grMenuId;
    const checkedIds = this.props.ClientPackageVersionProps.getIn(['viewItems', this.props.match.params.grMenuId, 'checkedIds']);
    ClientPackageActions.readpackageSpecListPagedInVersionCompare(ClientPackageProps, compId, {
      page: 0,
      version1: checkedIds[0],
      version2: checkedIds[1]
    });
  };

  render() {
    const { classes } = this.props;
    const { ClientPackageSpecProps } = this.props;
    const { t, i18n } = this.props;
    const compId = this.props.match.params.grMenuId;
    return (
      <React.Fragment>
        <GRPageHeader name={t(this.props.match.params.grMenuName)} />
        <GRPane>
          <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
            <Grid item xs={2} sm={2} lg={2} style={{ border: '1px solid #efefef' }}>
              <Toolbar elevation={0} style={{ minHeight: 50, padding: 0 }}>
                <Grid container spacing={0} alignItems="center" direction="row" justify="space-between">
                  <Grid item xs={3} sm={3} lg={3}>
                  </Grid>
                  <Grid item xs={9} sm={9} lg={9} style={{ textAlign: 'right' }}>
                    <Tooltip title={t("ttComparePackgeVersion")}>
                      <span>
                        <Button className={classes.GRSmallButton} variant="contained" color="primary" onClick={this.handleCompareClick} disabled={!(this.isVersionChecked())} style={{ marginRight: "10px" }} >
                          {t("btnCompareVer")}
                        </Button>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Toolbar>

              <VersionListComp compId={compId}
                onSelect={this.handleVersionSelect}
              />
            </Grid>
            <Grid item xs={10} sm={10} lg={10} style={{ border: '1px solid #efefef' }}>
              <Toolbar elevation={0} style={{ minHeight: 0, padding: 0 }}>
                <Grid container spacing={8} alignItems="flex-start" direction="row" justify="space-between" >
                  <Grid item xs={6} sm={6} lg={6} >
                  </Grid>
                </Grid>
              </Toolbar>
              <PackageCompWithVersion compId={compId} />
            </Grid>

            <Grid item xs={12} sm={12} lg={12} style={{ border: '1px solid #efefef' }}>
              <ClientPackageVersionComp compId={compId} />
            </Grid>
          </Grid>
        </GRPane>
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  ClientPackageProps: state.ClientPackageModule,
  ClientPackageSpecProps: state.ClientPackageSpecModule,
  ClientPackageVersionProps: state.ClientPackageVersionModule,
});

const mapDispatchToProps = (dispatch) => ({
  GlobalActions: bindActionCreators(GlobalActions, dispatch),
  GRAlertActions: bindActionCreators(GRAlertActions, dispatch),
  ClientPackageActions: bindActionCreators(ClientPackageActions, dispatch),
  ClientPackageSpecActions: bindActionCreators(ClientPackageSpecActions, dispatch),
  ClientPackageVersionActions: bindActionCreators(ClientPackageVersionActions, dispatch),
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(VersionSpecManage)));


