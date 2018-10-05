import React, { Component } from "react";
import { Map, List } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import * as DesktopAppActions from 'modules/DesktopAppModule';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

//
//  ## Content ########## ########## ########## ########## ########## 
//
class DesktopAppInform extends Component {

  // .................................................

  render() {

    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const { DesktopAppProps, compId } = this.props;
    const informOpen = DesktopAppProps.getIn(['viewItems', compId, 'informOpen']);
    const selectedViewItem = DesktopAppProps.getIn(['viewItems', compId, 'selectedViewItem']);

    return (
      <div>
      {(informOpen && selectedViewItem) &&
        <Card style={{boxShadow:this.props.compShadow}} >
          <CardHeader
            title={(selectedViewItem) ? selectedViewItem.get('appNm') : ''}
            subheader={selectedViewItem.get('appId') + ', ' + formatDateToSimple(selectedViewItem.get('modDate'), 'YYYY-MM-DD')}
          />
          <CardContent>
            <Typography component="pre">
              "{selectedViewItem.get('appInfo')}"
            </Typography>
            
            <Divider />
            <br />
            <Table>
              <TableBody>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 데스크톱앱 아이디</TableCell>
                  <TableCell numeric>{selectedViewItem.get('appId')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 데스크톱앱 이름</TableCell>
                  <TableCell numeric>{selectedViewItem.get('appNm')}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">{bull} 데스크톱앱 상세 정보</TableCell>
                  <TableCell numeric>{selectedViewItem.get('appInfo')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 데스크톱앱 종류</TableCell>
                  <TableCell numeric>{selectedViewItem.get('appGubun')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 실행 명령어</TableCell>
                  <TableCell numeric>{selectedViewItem.get('appExec')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} 서비스 상태</TableCell>
                  <TableCell numeric>{selectedViewItem.get('statusCd')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} Icon 구분</TableCell>
                  <TableCell numeric>{selectedViewItem.get('iconGubun')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">{bull} Icon 정보</TableCell>
                  <TableCell numeric>{selectedViewItem.get('iconNm')}</TableCell>
                </TableRow>

              </TableBody>
            </Table>

          </CardContent>
        </Card>
      }
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  DesktopAppProps: state.DesktopAppModule
});

const mapDispatchToProps = (dispatch) => ({
  DesktopAppActions: bindActionCreators(DesktopAppActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(GrCommonStyle)(DesktopAppInform));

