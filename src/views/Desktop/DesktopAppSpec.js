import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GRUtils/GRDates';
import { getSelectedObjectInComp, getSelectedObjectInCompAndId, getAvatarForRuleGrade } from 'components/GRUtils/GRTableListUtils';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import DesktopAppDialog from './DesktopAppDialog';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import CopyIcon from '@material-ui/icons/FileCopy';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopAppSpec extends Component {

  render() {

    const { classes } = this.props;
    const { compId, compType, targetType, selectedItem } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    let viewItem = null;
    let GRAvartar = null;
    if(selectedItem) {
      viewItem = selectedItem.get('viewItem');
      GRAvartar = getAvatarForRuleGrade(targetType, "DESKTOP_APP");
    }

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={4} style={{marginBottom:20}}>
            <CardHeader
              avatar={GRAvartar}
              title={viewItem.get('appNm')} 
              subheader={viewItem.get('appId') + ', ' + viewItem.get('appInfo')}
              action={
                <div style={{paddingTop:16,paddingRight:24}}>
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32}}
                    onClick={() => this.props.handleEditClick(viewItem, compType)}
                  ><SettingsApplicationsIcon /></Button>
                  {(this.props.handleCopyClick) &&
                  <Button size="small"
                    variant="outlined" color="primary" style={{minWidth:32,marginLeft:10}}
                    onClick={() => this.props.handleCopyClick(viewItem)}
                  ><CopyIcon /></Button>
                  }
                </div>
              }
              style={{paddingBottom:0}}
            />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 데스크톱앱 종류</TableCell>
                  <TableCell numeric>{viewItem.get('appGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 실행 명령어</TableCell>
                  <TableCell numeric style={{wordBreak: 'break-word'}}>{viewItem.get('appExec')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 마운트 URL</TableCell>
                  <TableCell numeric>{viewItem.get('appMountUrl')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 마운트 포인트</TableCell>
                  <TableCell numeric>{viewItem.get('appMountPoint')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 서비스 상태</TableCell>
                  <TableCell numeric>{viewItem.get('statusCd')}</TableCell>
                  <TableCell component="th" scope="row">{bull} 수정일</TableCell>
                  <TableCell numeric>{formatDateToSimple(viewItem.get('modDate'), 'YYYY-MM-DD')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} Icon 구분</TableCell>
                  <TableCell numeric>{viewItem.get('iconGubun')}</TableCell>
                  <TableCell component="th" scope="row">{bull} Icon 정보</TableCell>
                  <TableCell numeric>{(viewItem.get('iconGubun') == 'favicon') ? viewItem.get('iconUrl') : viewItem.get('iconNm')}</TableCell>
                </TableRow>

              </TableBody>
            </Table>
            </CardContent>
          </Card>
        }
      <DesktopAppDialog compId={compId} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  BrowserRuleProps: state.BrowserRuleModule
});

const mapDispatchToProps = (dispatch) => ({
  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DesktopAppSpec));

