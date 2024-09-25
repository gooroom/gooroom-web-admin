import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { translate, Trans } from "react-i18next";

import * as ClientPackageVersionActions from 'modules/ClientPackageVersionModule';
import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp } from 'components/GRUtils/GRTableListUtils';

import KeywordOption from "views/Options/KeywordOption";

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Checkbox from "@material-ui/core/Checkbox";
import Search from '@material-ui/icons/Search';
import CheckIcon from "@material-ui/icons/Check";
import { withStyles } from '@material-ui/core/styles';

import { GRCommonStyle } from 'templates/styles/GRStyles';

class VersionListComp extends Component {

  componentDidMount() {
    const { ClientPackageVersionActions, ClientPackageVersionProps, compId } = this.props;
    ClientPackageVersionActions.readPackageSpecList(ClientPackageVersionProps, compId);
  }

  componentDidUpdate(prevProps) {
    const { ClientPackageVersionProps, compId } = this.props;
    const prevListObj = prevProps.ClientPackageVersionProps.getIn(['viewItems', compId, 'listData']);
    const currentListObj = ClientPackageVersionProps.getIn(['viewItems', compId, 'listData']);

    // 데이터가 처음 로드된 후 첫 번째 항목이 있을 때만 선택
    if (!prevListObj && currentListObj && currentListObj.size > 0) {
      const firstRowId = currentListObj.get(0).get('isoVer');
      this.handleSelectRow({ stopPropagation: () => { } }, firstRowId);  // 첫 번째 항목 선택
    }
  }

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { ClientPackageVersionActions, ClientPackageVersionProps, compId } = this.props;
    const selectRowObject = getRowObjectById(ClientPackageVersionProps, compId, id, 'isoVer');

    if (this.props.onSelect) {
      this.props.onSelect(selectRowObject);
    }
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { ClientPackageVersionProps, compId } = this.props;

    // 현재 체크된 ID 목록 가져오기
    const checkedIds = getDataObjectVariableInComp(ClientPackageVersionProps, compId, 'checkedIds') || [];

    // ID가 체크된 상태면 해제
    if (checkedIds.includes(id)) {
      const newCheckedIds = checkedIds.filter(checkedId => checkedId !== id);
      this.updateCheckedIds(newCheckedIds);
    } else {
      if (checkedIds.length >= 2) {
        const newCheckedIds = [...checkedIds.slice(1), id];
        this.updateCheckedIds(newCheckedIds);
      } else {
        const newCheckedIds = [...checkedIds, id];
        this.updateCheckedIds(newCheckedIds);
      }
    }
  }

  updateCheckedIds = (newCheckedIds) => {
    const { ClientPackageVersionActions, compId } = this.props;
    ClientPackageVersionActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });
  }

  isChecked = id => {
    const { ClientPackageVersionProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientPackageVersionProps, compId, 'checkedIds') || [];
    return checkedIds.includes(id);
  }

  isSelected = id => {
    const { ClientPackageVersionProps, compId } = this.props;
    const selectId = getDataObjectVariableInComp(ClientPackageVersionProps, compId, 'selectId');
    return (selectId == id);
  }

  handleChangePage = (event, page) => {
    const { ClientPackageVersionActions, ClientPackageVersionProps, compId } = this.props;
    ClientPackageVersionActions.readPackageSpecList(ClientPackageVersionProps, compId, {
      page: page
    });
  };

  handleKeywordChange = (name, value) => {
    this.props.ClientPackageVersionActions.changeListParamData({
      name: name,
      value: value,
      compId: this.props.compId
    });
  };

  handleSelectBtnClick = () => {
    const { ClientPackageVersionActions, ClientPackageVersionProps, compId } = this.props;
    ClientPackageVersionActions.readPackageSpecList(ClientPackageVersionProps, compId);
  };

  isVersionChecked = () => {
    const { ClientPackageVersionProps, compId } = this.props;
    const checkedIds = ClientPackageVersionProps.getIn(['viewItems', compId, 'checkedIds']);
    return (checkedIds && 2 < checkedIds.size < 4);
  }

  render() {
    const { classes } = this.props;
    const { ClientPackageVersionProps, compId } = this.props;
    const { t, i18n } = this.props;
    const listObj = ClientPackageVersionProps.getIn(['viewItems', compId]);
    let emptyRows = 0;

    return (
      <div>
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          {/* 버전 검색 기능 */}
          {/* <Grid item xs={4} >
            <KeywordOption paramName="keyword" keywordValue={(listObj && listObj.get('listParam')) ? listObj.getIn(['listParam', 'keyword']) : ''}
              handleKeywordChange={this.handleKeywordChange}
              handleSubmit={() => this.handleSelectBtnClick()} />
          </Grid>
          <Grid item xs={4} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} >
              <Search />{t("btnSearch")}
            </Button>
          </Grid> */}
          <Grid item xs={4} >
          </Grid>
        </Grid>

        {/* data area */}
        {(listObj && listObj.get('listParam')) &&
          <Table>
            <TableBody>
              {listObj.get('listData').map(n => {
                const isChecked = this.isChecked(n.get('isoVer'));
                const isSelected = this.isSelected(n.get('isoVer'));

                return (
                  <TableRow
                    hover
                    className={(isSelected) ? classes.grSelectedRow : ''}
                    onClick={event => this.handleSelectRow(event, n.get('isoVer'))}
                    role="checkbox"
                    key={n.get('isoVer')}
                  >
                    <TableCell padding="checkbox" className={classes.grSmallAndClickCell} style={{ width: '50px' }}>
                      <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('isoVer'))} />
                    </TableCell>
                    <TableCell className={classes.grSmallAndClickAndLeftCell} style={{ width: '50px' }}>{n.get('isoVer')}</TableCell>
                    <TableCell className={classes.grSmallAndClickAndLeftCell} >{n.get('integrity') === 'true' && <CheckIcon style={{ color: 'blue' }} />}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientPackageVersionProps: state.ClientPackageVersionModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientPackageVersionActions: bindActionCreators(ClientPackageVersionActions, dispatch),
  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(VersionListComp)));

