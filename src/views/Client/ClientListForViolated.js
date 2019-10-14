import React, { Component } from "react";
import { Map, List, fromJS } from 'immutable';

import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as GRConfirmActions from 'modules/GRConfirmModule';
import * as GRAlertActions from 'modules/GRAlertModule';

import GRConfirm from 'components/GRComponents/GRConfirm';
import GRAlert from 'components/GRComponents/GRAlert';

import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import Search from "@material-ui/icons/Search";

import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

import ViolatedIcon from '@material-ui/icons/Error';
import ServiceStoppedIcon from '@material-ui/icons/PauseCircleOutline';
import ServiceRunningIcon from '@material-ui/icons/PlayCircleFilled';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

import { requestPostAPI } from 'components/GRUtils/GRRequester';
import { translate, Trans } from "react-i18next";


class ClientListForViolated extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stateData: Map({
        listData: List([]),
        listParam: Map({
          keyword: '',
          orderDir: 'asc',
          orderColumn: 'CLIENT_NM',
          page: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: List([5, 10, 25]),
          rowsTotal: 0,
          rowsFiltered: 0
        }),
        checkedIds: List([])
      })
    };
  }

  handleGetClientList = (newListParam) => {
    requestPostAPI('readViolatedClientList', {
      keyword: newListParam.get('keyword'),
      page: newListParam.get('page'),
      start: newListParam.get('page') * newListParam.get('rowsPerPage'),
      length: newListParam.get('rowsPerPage'),
      orderColumn: newListParam.get('orderColumn'),
      orderDir: newListParam.get('orderDir')
    }).then(
      (response) => {
        const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = response.data;
        const { stateData } = this.state;
        this.setState({
          stateData: stateData
            .set('listData', List(data.map((e) => {return Map(e)})))
            .set('listParam', newListParam.merge({
              rowsFiltered: parseInt(recordsFiltered, 10),
              rowsTotal: parseInt(recordsTotal, 10),
              page: parseInt(draw, 10),
              rowsPerPage: parseInt(rowLength, 10),
              orderColumn: orderColumn,
              orderDir: orderDir
            }))
        });
      }
    ).catch(error => {
    });
  }

  componentDidMount() {
    this.handleSelectBtnClick();
  }

  handleChangePage = (event, page) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      page: page
    });
    this.handleGetClientList(newListParam);
  };

  handleChangeRowsPerPage = event => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      rowsPerPage: event.target.value, page: 0
    });
    this.handleGetClientList(newListParam);
  };

  handleChangeSort = (columnId, currOrderDir) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
    this.handleGetClientList(newListParam);
  };
  // .................................................

  handleSelectRow = (event, id) => {
    const { stateData } = this.state;
    const checkedIds = stateData.get('checkedIds');
    let newCheckedIds = null;
    if(checkedIds) {
        const indexNo = checkedIds.indexOf(id);
        if(indexNo > -1) {
          newCheckedIds = checkedIds.delete(indexNo);
        } else {
          newCheckedIds = checkedIds.push(id);
        }
    } else {
      newCheckedIds = List([id]);
    }
    this.setState({ stateData: stateData.set('checkedIds', newCheckedIds) });
    this.props.onSelectClient(newCheckedIds);
  };

  handleKeywordChange = (name, value) => {
    const { stateData } = this.state;
    const newListParam = (stateData.get('listParam')).merge({
      keyword: value, page: 0
    });
    this.setState({
      stateData: stateData.set('listParam', newListParam)
    });
    // 아래 커멘트 제거시, 타이프 칠때마다 조회
    //this.handleGetClientList(newListParam);
  }

  handleSelectBtnClick = () => {
    const { stateData } = this.state;
    const newListParam = stateData.get('listParam');
    this.handleGetClientList(newListParam);
  };

  handleClickRepairClient = (clientId) => {
    const { t, i18n } = this.props;

    if(clientId && clientId != '') {
      this.props.GRConfirmActions.showConfirm({
        confirmTitle: t("lbRepairViolatedClient"),
        confirmMsg: t("msgRepairViolatedClient", {clientId: clientId}),
        handleConfirmResult: ((confirmValue, confirmObject) => {
          if(confirmValue) {
            requestPostAPI('createResetViolatedClient', confirmObject).then(
              (response) => {
                if(response && response.data && response.data.status && response.data.status.result == 'success') {
                  this.props.GRAlertActions.showAlert({
                    alertTitle: t("lbRepairJob"),
                    alertMsg: t("msgRepairJob")
                  });
                } else {
                  this.props.GRAlertActions.showAlert({
                    alertTitle: t("dtSystemError"),
                    alertMsg: t("msgRepairJobFail")
                  });
                }
              }
            ).catch(error => {
            });
          }}),
        confirmObject: {clientId: clientId}
      });
    }
  }

  handleClickItem = (type, clientId) => {
    this.props.onClickItem(type, clientId);
  }

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;

    const listObj = this.state.stateData;
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <div>
        {/* data option area */}
        <Grid container alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={4}>
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" handleKeywordChange={this.handleKeywordChange} handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
          </Grid>
          <Grid item xs={7}>
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={ () => this.handleSelectBtnClick() } >
              <Search />{t("btnSearch")}
            </Button>
          </Grid>
        </Grid>
      {(listObj) &&
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2}
                sortDirection={listObj.getIn(['listParam', 'orderColumn']) === 'CLIENT_ID' ? listObj.getIn(['listParam', 'orderDir']) : false}
              >{t("colClientId")}
              </TableCell>

              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2}
                sortDirection={listObj.getIn(['listParam', 'orderColumn']) === 'CLIENT_NM' ? listObj.getIn(['listParam', 'orderDir']) : false}
              >{t("colClientName")}
              </TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} colSpan={4}>{t("colViolateStatus")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} colSpan={4}>{t("colViolateRun")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} rowSpan={2} >{t("colRepair")}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colBootProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colExeProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colOSProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colMediaProtect")}</TableCell>

              <TableCell className={classes.grSmallAndHeaderCell} >{t("colBootProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colExeProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colOSProtect")}</TableCell>
              <TableCell className={classes.grSmallAndHeaderCell} >{t("colMediaProtect")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listObj.get('listData').map(n => {
              return (
                <TableRow hover key={n.get('clientId')} >
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientId')}</TableCell>
                  <TableCell className={classes.grSmallAndClickCell} >{n.get('clientName')}</TableCell>

                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('countBootProtector') > 0) ? <ViolatedIcon color="primary" onClick={() => this.handleClickItem('BOOT', n.get('clientId'))} /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('countExeProtector') > 0) ? <ViolatedIcon color="primary" onClick={() => this.handleClickItem('EXE', n.get('clientId'))} /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('countOsProtector') > 0) ? <ViolatedIcon color="primary" onClick={() => this.handleClickItem('OS', n.get('clientId'))} /> : ''}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('countMediaProtector') > 0) ? <ViolatedIcon color="primary" onClick={() => this.handleClickItem('MEDIA', n.get('clientId'))} /> : ''}</TableCell>

                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopBootProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopExeProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopOsProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell} >{(n.get('isStopMediaProtector') == 1) ? <ServiceRunningIcon color="primary" /> : <ServiceStoppedIcon color="primary" />}</TableCell>
                  
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>
                    <Button color="secondary" size="small" className={classes.buttonInTableRow} onClick={event => this.handleClickRepairClient(n.get('clientId'))}>
                      <SettingsApplicationsIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
              <TableRow key={e}>
                <TableCell
                  colSpan={13}
                  className={classes.grSmallAndClickCell}
                />
              </TableRow>
            )}))}
          </TableBody>
        </Table>
      }
      {listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
        <TablePagination
          component='div'
          count={listObj.getIn(['listParam', 'rowsFiltered'])}
          rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
          rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
          page={listObj.getIn(['listParam', 'page'])}
          labelDisplayedRows={() => {return ''}}
          backIconButtonProps={{
            'aria-label': 'Previous Page'
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page'
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      }
      <GRConfirm />
      {/*<GRAlert /> */}
      </div>
    );

  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch),
    GRAlertActions: bindActionCreators(GRAlertActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientListForViolated)));

