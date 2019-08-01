import React, { Component } from 'react';
import { Map } from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as DeptActions from 'modules/DeptModule';

import { getRowObjectById, getDataObjectVariableInComp, setCheckedIdsInComp, getDataPropertyInCompByParam } from 'components/GRUtils/GRTableListUtils';

import GRCommonTableHead from 'components/GRComponents/GRCommonTableHead';
import KeywordOption from "views/Options/KeywordOption";

import DeptDialog from './DeptDialog';

import Grid from '@material-ui/core/Grid';
import GRTreeDeptList from "components/GRTree/GRTreeDeptList";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControl from '@material-ui/core/FormControl';
import Checkbox from "@material-ui/core/Checkbox";
import Button from '@material-ui/core/Button';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import Search from '@material-ui/icons/Search'; 
import TreeIcon from '@material-ui/icons/DeviceHub'; 

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';
import { translate, Trans } from "react-i18next";

class DeptTreeComp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isShowTree: true
    };
  }

  componentDidMount() {
    //this.props.DeptActions.readDeptListPaged(this.props.DeptProps, this.props.compId);
  }

  handleChangePage = (event, page) => {
    this.props.DeptActions.readDeptListPaged(this.props.DeptProps, this.props.compId, {
      page: page
    });
  };

  handleChangeRowsPerPage = event => {
    this.props.DeptActions.readDeptListPaged(this.props.DeptProps, this.props.compId, {
      rowsPerPage: event.target.value, page: 0
    });
  };

  handleChangeSort = (event, columnId, currOrderDir) => {
    this.props.DeptActions.readDeptListPaged(this.props.DeptProps, this.props.compId, {
      orderColumn: columnId, orderDir: (currOrderDir === 'desc') ? 'asc' : 'desc'
    });
  };

  // edit
  handleEditClick = (event, id) => {
    const { DeptProps, DeptActions, compId } = this.props;
    const viewItem = getRowObjectById(DeptProps, compId, id, 'deptCd');
    DeptActions.showDialog({
      viewItem: viewItem,
      dialogType: DeptDialog.TYPE_EDIT
    });
  };

  handleCheckClick = (event, id) => {
    event.stopPropagation();
    const { DeptProps, DeptActions, compId } = this.props;
    const newCheckedIds = setCheckedIdsInComp(DeptProps, compId, id);

    DeptActions.changeCompVariable({
      name: 'checkedIds',
      value: newCheckedIds,
      compId: compId
    });

    if(this.props.onCheck) {
      this.props.onCheck(newCheckedIds);
    }
  }

  handleCheckAllClick = (event, checked) => {
    event.stopPropagation();
    const { DeptActions, DeptProps, compId } = this.props;
    const newCheckedIds = getDataPropertyInCompByParam(DeptProps, compId, 'deptCd', checked);

    DeptActions.changeCompVariable({
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
    const { DeptProps, compId } = this.props;
    // get Object
    const selectRowObject = getRowObjectById(DeptProps, compId, id, 'deptCd');

    if(this.props.onSelect && selectRowObject) {
      this.props.onSelect(Map({
        deptCd: selectRowObject.get('deptCd'),
        deptNm: selectRowObject.get('deptNm'),
        comment: selectRowObject.get('comment'),
        regDate: selectRowObject.get('regDate'),
        hasChildren: selectRowObject.get('hasChildren')
      }));
    }

  };

  isChecked = id => {
    const { DeptProps, compId } = this.props;
    const checkedIds = getDataObjectVariableInComp(DeptProps, compId, 'checkedIds');

    if(checkedIds) {
      return checkedIds.includes(id);
    } else {
      return false;
    }
  }

  isSelected = id => {
    const { DeptProps, compId } = this.props;
    const selectedGroupItem = getDataObjectVariableInComp(DeptProps, compId, 'viewItem');
    return (selectedGroupItem && selectedGroupItem.get('deptCd') == id);
  }

  // .................................................
  handleKeywordChange = (name, value) => {
    this.props.DeptActions.changeListParamData({
      name: name, 
      value: value,
      compId: this.props.compId
    });
  }

  handleSelectBtnClick = () => {
    const { DeptActions, DeptProps } = this.props;
    const keyword = DeptProps.getIn(['viewItems', this.props.compId, 'listParam', 'keyword']);
    if(keyword && keyword != '') {
      this.setState({
        isShowTree: false
      })
      DeptActions.readDeptListPaged(DeptProps, this.props.compId, {page: 0});
    }
  };

  handleShowTreeBtnClick = () => {
    this.props.DeptActions.changeListParamData({
      name: 'keyword', 
      value: '',
      compId: this.props.compId
    });
    this.setState({
      isShowTree: true
    })
  };

  handleInitTreeData = () => {
  }

  // click group checkbox (in tree)
  handleCheckedDept = (checkedDeptCdArray, imperfect) => {
    if(this.props.onCheck) {
      this.props.onCheck(checkedDeptCdArray);
    }
  }

  // click group row (in tree)
  handleSelectDept = (treeNode) => {
    if(this.props.onSelect) {
      this.props.onSelect(Map({
        deptCd: treeNode.get('key'),
        deptNm: treeNode.get('title'),
        comment: treeNode.get('comment'),
        regDate: treeNode.get('regDate'),
        hasChildren: treeNode.get('hasChildren')
      }));
    }
  }

  // edit group in tree
  handleEditDept = (treeNode) => {
    if(this.props.onEdit) {
      this.props.onEdit(Map({
        deptCd: treeNode.get('key'),
        deptNm: treeNode.get('title'),
        comment: treeNode.get('comment'),
        regDate: treeNode.get('regDate'),
        hasChildren: treeNode.get('hasChildren')
      }));
    }
  };

  // edit group in tree
  handleResetDeptInfo = (deptCd) => {
    this.grTreeList.resetTreeNode(deptCd);
  }


  render() {
    const { classes, t } = this.props;
    const { DeptProps, compId, hasEdit=false, selectorType } = this.props;
    const keyword = (DeptProps.getIn(['viewItems', compId, 'listParam', 'keyword'])) ? DeptProps.getIn(['viewItems', compId, 'listParam', 'keyword']) : '';
    let columnHeaders = [
      { id: "chDeptNm", isOrder: true, numeric: false, disablePadding: true, label: t("colDeptName") },
      { id: "chUserCount", isOrder: true, numeric: false, disablePadding: true, label: t("colUserCount") },
      { id: 'chAction', isOrder: false, numeric: false, disablePadding: true, label: t("colEdit") },
    ];

    if(!hasEdit) {
      columnHeaders.pop();
    }

    if(selectorType && selectorType == 'multiple') {
      columnHeaders.unshift({ id: "chCheckbox", isCheckbox: true });
    }

    const listObj = DeptProps.getIn(['viewItems', compId]);
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
              keyId="deptCd"
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
              keyId="deptCd"
              isDisableAllCheck={true}
              orderDir={listObj.getIn(['listParam', 'orderDir'])}
              orderColumn={listObj.getIn(['listParam', 'orderColumn'])}
              onRequestSort={this.handleChangeSort}
              columnData={columnHeaders}
            />
            }
            <TableBody>
            {listObj.get('listData') && listObj.get('listData').map(n => {
              const isChecked = this.isChecked(n.get('deptCd'));
              const isSelected = this.isSelected(n.get('deptCd'));
  
              return (
                <TableRow
                  hover
                  className={(isSelected) ? classes.grSelectedRow : ''}
                  onClick={event => this.handleSelectRow(event, n.get('deptCd'))}
                  role="checkbox"
                  key={n.get('deptCd')}
                >
                  {(selectorType && selectorType == 'multiple') && 
                    <TableCell padding="checkbox" className={classes.grSmallAndClickCell} >
                      <Checkbox checked={isChecked} color="primary" className={classes.grObjInCell} onClick={event => this.handleCheckClick(event, n.get('deptCd'))} />
                    </TableCell>
                  }
                  <TableCell className={classes.grSmallAndClickCell}>{n.get('deptNm')}</TableCell>
                  <TableCell className={classes.grSmallAndClickAndCenterCell}>{n.get('itemCount')}/{n.get('itemTotalCount')}</TableCell>
                  {(hasEdit) && 
                    <TableCell className={classes.grSmallAndClickAndCenterCell}>
                      <Button color='secondary' size="small" 
                        className={classes.buttonInTableRow} 
                        onClick={event => this.handleEditClick(event, n.get('deptCd'))}>
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
          <GRTreeDeptList
            useFolderIcons={true}
            listHeight='24px'
            compId={compId}
            hasSelectChild={false}
            hasSelectParent={false}
            isEnableEdit={this.props.isEnableEdit}
            isActivable={this.props.isActivable}
            isShowMemberCnt={true}
            onInitTreeData={this.handleInitTreeData}
            onSelectNode={this.handleSelectDept}
            onCheckedNode={this.handleCheckedDept}
            onEditNode={this.handleEditDept}
          />
        </div>
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  DeptProps: state.DeptModule
});

const mapDispatchToProps = (dispatch) => ({
  DeptActions: bindActionCreators(DeptActions, dispatch)
});

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(withStyles(GRCommonStyle)(DeptTreeComp)));


