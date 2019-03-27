import React, { Component } from 'react';
import { Map, List } from 'immutable';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientGroupActions from 'modules/ClientGroupModule';

import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as ClientHostNameActions from 'modules/ClientHostNameModule';
import * as ClientUpdateServerActions from 'modules/ClientUpdateServerModule';

import * as BrowserRuleActions from 'modules/BrowserRuleModule';
import * as MediaRuleActions from 'modules/MediaRuleModule';
import * as SecurityRuleActions from 'modules/SecurityRuleModule';

import * as GRConfirmActions from 'modules/GRConfirmModule';

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import ClientGroupDialog from './ClientGroupDialog';

import Grid from '@material-ui/core/Grid';
import GRTreeClientGroupList from "components/GRTree/GRTreeClientGroupList";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Search from '@material-ui/icons/Search'; 
import TreeIcon from '@material-ui/icons/DeviceHub'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class ClientGroupTreeComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowTree: true
    };
  }

  componentDidMount() {
    //this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.ClientGroupActions.readClientGroupListPaged(this.props.ClientGroupProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // edit
  handleEditClick = (event, id) => {
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const viewItem = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    ClientGroupActions.showDialog({
      viewItem: viewItem,
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(ClientGroupProps, compId, id);

    ClientGroupActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    if(this.props.onCheck) {
      this.props.onCheck(newCheckedIds);
    }
  }

  handleCheckAllClick = (event, checked) => {

    const { ClientGroupActions, ClientGroupProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(ClientGroupProps, compId, 'grpId', checked);

    ClientGroupActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    if(this.props.onCheckAll) {
      this.props.onCheckAll(null, newCheckedIds);
    }
  };

  handleSelectRow = (event, id) => {
    event.stopPropagation();
    const { ClientGroupProps, ClientGroupActions, compId } = this.props;
    // get Object
    const selectRowObject = getRowObjectById(ClientGroupProps, compId, id, 'grpId');
    if(this.props.onSelect && selectRowObject) {
      this.props.onSelect(selectRowObject);
    }

  };

  isChecked = id => {
    const { ClientGroupProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(ClientGroupProps, compId, 'checkedIds');

    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { ClientGroupProps, compId } = this.props;
    const selectedGroupItem = getDataObjectVariableInComp(ClientGroupProps, compId, 'viewItem');
    return (selectedGroupItem && selectedGroupItem.get('grpId') == id);
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.ClientGroupActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleSelectBtnClick = () => {
    const { ClientGroupActions, ClientGroupProps } = this.props;
    const keyword = ClientGroupProps.getIn(['viewItems', this.props.compId, 'listParam', 'keyword']);
    if(keyword && keyword != '') {
      this.setState({
        isShowTree: false
      })
      ClientGroupActions.readClientGroupListPaged(ClientGroupProps, this.props.compId, {page: 0});

    } else {


    }
    
  };

  handleShowTreeBtnClick = () => {
    this.props.ClientGroupActions.changeListParamData({
      name: 'keyword', 
      value: '',
      compId: this.props.compId
    });
    this.setState({
      isShowTree: true
    })
};




























  handleInitTreeData = () => {
    // 필요없음. ????
    // this.props.ClientGroupActions.changeCompVariableObject({
    //   compId: this.props.compId,
    //   valueObj: {selectedGrpId: '', selectedGrpNm: ''}
    // });
  }

  // click group checkbox (in tree)
  handleCheckedClientGroup = (checkedGrpIdArray, imperfect) => {

    if(this.props.onCheck) {
      this.props.onCheck(checkedGrpIdArray);
    }

    // 이것은 상위에서 처리해야함
    // const { ClientManageProps, ClientManageActions } = this.props;
    // // set checkedGrpId
    // this.props.ClientGroupActions.changeCompVariableObject({
    //   compId: this.props.compId,
    //   valueObj: {checkedGrpId: checkedGrpIdArray}
    // });
    // // show client list in group.
    // ClientManageActions.readClientListPaged(ClientManageProps, this.props.compId, {
    //   groupId: checkedGrpIdArray.join(), page:0
    // }, {isResetSelect:true});
  }

  // click group row (in tree)
  handleSelectClientGroup = (treeNode) => {

    if(this.props.onSelect) {
      this.props.onSelect(treeNode.key);
    }

    // close client inform
    // 이것은 상위에서 처리해야함
    // ClientManageActions.closeClientManageInform({compId: compId});

    // 이것은 상위에서 처리해야함
    // ClientGroupActions.changeCompVariableObject({
    //   compId: compId,
    //   valueObj: {
    //     viewItem: (fromJS(treeNode)).merge(Map({
    //       grpId: treeNode.key,
    //       grpNm: treeNode.title,
    //       hasChildren: treeNode.hasChildren 
    //     })),
    //     informOpen: true
    //   }
    // });

    // 이것은 상위에서 처리해야함
    // this.showClientGroupSpec(compId, Map({
    //   key: treeNode.key,
    //   regDate: treeNode.regDate,
    //   comment: treeNode.comment,
    //   title: treeNode.title,
    //   hasChildren: treeNode.hasChildren,
    // }));
  }

  // edit group in tree
  handleEditClientGroup = (treeNode) => {
    this.props.ClientGroupActions.showDialog({
      viewItem: {
        grpId: treeNode.key,
        grpNm: treeNode.title
      },
      dialogType: ClientGroupDialog.TYPE_EDIT
    });
  };

  render() {
    const { classes, t } = this.props;
    const { ClientGroupProps, compId, hasEdit=false, selectorType } = this.props;
    const keyword = (ClientGroupProps.getIn(['viewItems', compId, 'listParam', 'keyword'])) ? ClientGroupProps.getIn(['viewItems', compId, 'listParam', 'keyword']) : '';
    let columnHeaders = [
      { id: "chGrpNm", isOrder: true, numeric: false, disablePadding: true, label: t("colGroupName") },
      { id: "chClientCount", isOrder: true, numeric: false, disablePadding: true, label: t("colClientCount") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEdit") },
    ];

    if(!hasEdit) {
      columnHeaders.pop();
    }

    if(selectorType && selectorType == 'multiple') {
      columnHeaders.unshift({ id: "chCheckbox", isCheckbox: true });
    }

    const listObj = ClientGroupProps.getIn(['viewItems', compId]);
    let emptyRows = 0; 
    if(listObj && listObj.get('listData')) {
      emptyRows = listObj.getIn(['listParam', 'rowsPerPage']) - listObj.get('listData').size;
    }

    return (
      <React.Fragment>
        {/* data option area */}
        <Grid container spacing={8} alignItems="flex-end" direction="row" justify="space-between" >
          <Grid item xs={6} >
            <FormControl fullWidth={true}>
              <KeywordOption paramName="keyword" keywordValue={keyword}
                handleKeywordChange={this.handleKeywordChange} 
                handleSubmit={() => this.handleSelectBtnClick()} />
            </FormControl>
          </Grid>
          <Grid item xs={6} >
            <Button className={classes.GRIconSmallButton} variant="contained" color="secondary" onClick={() => this.handleSelectBtnClick()} style={{marginRight:10}}>
              <Search />{t("btnSearch")}
            </Button>
            {!this.state.isShowTree &&
            <Button className={classes.GRIconSmallButton} variant="contained" color="primary" onClick={() => this.handleShowTreeBtnClick()} >
              <TreeIcon />{t("stAll")}
            </Button>
            }
          </Grid>
        </Grid>

        {!this.state.isShowTree && listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
          <Table>
            {(selectorType && selectorType == 'multiple') && 
            <GRCommonTableHead
              classes={classes}
              keyId="grpId"
              orderDir={listObj.getIn(['listParam', 'orderDir'])}
              orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
              onRequestSort={this.handleChangeSort}
              onClickAllCheck={this.handleCheckAllClick}
              checkedIds={listObj.get('checkedIds')}
              listData={listObj.get('listData')}
              columnData={columnHeaders}
            />
            }
            {(!selectorType || selectorType == 'single') && 
            <GRCommonTableHead
              classes={classes}
              keyId="grpId"
              orderDir={listObj.getIn(['listParam', 'orderDir'])}
              orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
              onRequestSort={this.handleChangeSort}
              columnData={columnHeaders}
            />
            }
            <TableBody>
            {listObj.get('listData') && listObj.get('listData').map(n => {
              const isChecked = this.isChecked(n.get('grpId'));
              const isSelected = this.isSelected(n.get('grpId'));
  
              return (
                <TableRow
                  hover
                  className={(isSelected) ? classes.grSelectedRow : ''}
                  onClick={event => this.handleSelectRow(event, n.get('grpId'))}
                  role="checkbox"
                  key={n.get('grpId')}
                >
                  {(selectorType && selectorType == 'multiple') && 
                    <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                      <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('grpId'))} />
                    </TableCell>
                  }
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('grpNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndNumericCell}>{n.get('clientCount')}</TableCell>
                  {(hasEdit) && 
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      <Button color='secondary' size="small" 
                        className={classes.buttonInTableRow} 
                        onClick={event => this.handleEditClick(event, n.get('grpId'))}>
                        <SettingsApplicationsIcon />
                      </Button>
                    </TableCell>
                  }
                </TableRow>
              );
            })}
  
            {emptyRows > 0 && (( Array.from(Array(emptyRows).keys()) ).map(e => {return (
              <TableRow key={e}>
                <TableCell
                  colSpan={columnHeaders.length + 1}
                  className={classes.grSmallAndClickCell}
                />
              </TableRow>
            )}))}
            </TableBody>
          </Table>
        }
        {!this.state.isShowTree && listObj && listObj.get('listData') && listObj.get('listData').size > 0 &&
          <TablePagination
            component='div'
            count={listObj.getIn(['listParam', 'rowsFiltered'])}
            rowsPerPage={listObj.getIn(['listParam', 'rowsPerPage'])}
            rowsPerPageOptions={listObj.getIn(['listParam', 'rowsPerPageOptions']).toJS()}
            page={listObj.getIn(['listParam', 'page'])}
            labelDisplayedRows={() => {return ''}}
            labelRowsPerPage=""
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
        {this.state.isShowTree && 
        <div style={{maxHeight:411,overflowY:'auto',marginTop:10}}>
          <GRTreeClientGroupList
            useFolderIcons={true}
            listHeight='24px'
            hasSelectChild={false}
            hasSelectParent={false}
            compId={compId}
            isEnableEdit={this.props.isEnableEdit}
            onInitTreeData={this.handleInitTreeData}
            onSelectNode={this.handleSelectClientGroup}
            onCheckedNode={this.handleCheckedClientGroup}
            onEditNode={this.handleEditClientGroup}
            onRef={ref => (this.grTreeList = ref)}
          />
        </div>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ClientGroupProps: state.ClientGroupModule,
  ClientConfSettingProps: state.ClientConfSettingModule,
  ClientHostNameProps: state.ClientHostNameModule,
  ClientUpdateServerProps: state.ClientUpdateServerModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),

  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  ClientHostNameActions: bindActionCreators(ClientHostNameActions, dispatch),
  ClientUpdateServerActions: bindActionCreators(ClientUpdateServerActions, dispatch),

  BrowserRuleActions: bindActionCreators(BrowserRuleActions, dispatch),
  MediaRuleActions: bindActionCreators(MediaRuleActions, dispatch),
  SecurityRuleActions: bindActionCreators(SecurityRuleActions, dispatch),

  GRConfirmActions: bindActionCreators(GRConfirmActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(ClientGroupTreeComp)));


