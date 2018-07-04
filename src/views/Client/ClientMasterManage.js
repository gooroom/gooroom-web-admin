import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientManageActions from '../../modules/ClientManageModule';
import * as GrConfirmActions from '../../modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from '../../components/GrUtils/GrDates';
import { getMergedListParam, arrayContainsArray } from '../../components/GrUtils/GrCommonUtils';

import { grRequestPromise } from "../../components/GrUtils/GrRequester";
import GrPageHeader from "../../containers/GrContent/GrPageHeader";
import GrPane from '../../containers/GrContent/GrPane';

import ClientDialog from "./ClientDialog";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import DescIcon from '@material-ui/icons/Description';

import Checkbox from "@material-ui/core/Checkbox";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

// option components
import ClientGroupSelect from '../Options/ClientGroupSelect';
import ClientStatusSelect from '../Options/ClientStatusSelect';



import ClientManageComp from '../Client/ClientManageComp';
import ClientGroupComp from '../ClientGroup/ClientGroupComp';
import Card from "@material-ui/core/Card";


//
//  ## Theme override ########## ########## ########## ########## ########## 
//
const theme = createMuiTheme();

//
//  ## Style ########## ########## ########## ########## ########## 
//
const contentClass = css({
  height: "100% !important"
}).toString();

const pageContentClass = css({
  paddingTop: "14px !important"
}).toString();

const formClass = css({
  marginBottom: "6px !important",
    display: "flex"
}).toString();

const formControlClass = css({
  minWidth: "100px !important",
    marginRight: "15px !important",
    flexGrow: 1
}).toString();

const formEmptyControlClass = css({
  flexGrow: "6 !important"
}).toString();

const textFieldClass = css({
  marginTop: "3px !important"
}).toString();

const buttonClass = css({
  margin: theme.spacing.unit + " !important"
}).toString();

const leftIconClass = css({
  marginRight: theme.spacing.unit + " !important"
}).toString();


const tableClass = css({
  minWidth: "700px !important"
}).toString();

const tableHeadCellClass = css({
  whiteSpace: "nowrap",
  padding: "0px !important"
}).toString();

const tableContainerClass = css({
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    position: "absolute",
    height: 10,
    marginLeft: "-10px",
    },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#CFD8DC", 
    },
  "&::-webkit-scrollbar-thumb": {
    height: "30px",
    backgroundColor: "#78909C",
    backgroundClip: "content-box",
    borderColor: "transparent",
    borderStyle: "solid",
    borderWidth: "1px 1px",
    }
}).toString();

const tableRowClass = css({
  height: "2em !important"
}).toString();

const tableCellClass = css({
  height: "1em !important",
  padding: "0px !important",
  cursor: "pointer"
}).toString();

const toolIconClass = css({
  height: '16px !important',
}).toString();

const compInPaperClass = css({
  marginLeft: 10, 
  marginRight: 10
}).toString();

//
//  ## Content ########## ########## ########## ########## ########## 
//
class ClientMasterManage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  // .................................................

  isSelected = id => {
    
    const { ClientManageActions, ClientManageProps } = this.props;
    return ClientManageProps.selected.indexOf(id) !== -1;
  }

  handleChangePage = (event, page) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {page: page}));
  };

  handleChangeRowsPerPage = event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {rowsPerPage: event.target.value}));
  };

  handleSelectBtnClick = (param) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, param));
  };

  handleKeywordChange = name => event => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const newParam = getMergedListParam(ClientManageProps.listParam, {keyword: event.target.value});
    ClientManageActions.changeParamValue({
      name: 'listParam',
      value: newParam
    });
  };

  handleRowClick = (event, id) => {
    const { ClientManageActions, ClientManageProps } = this.props;
    const { selected : preSelected } = ClientManageProps;
    const selectedIndex = preSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(preSelected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(preSelected.slice(1));
    } else if (selectedIndex === preSelected.length - 1) {
      newSelected = newSelected.concat(preSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        preSelected.slice(0, selectedIndex),
        preSelected.slice(selectedIndex + 1)
      );
    }

    ClientManageActions.changeStoreData({
      name: 'selected',
      value: newSelected
    });
  };

  handleInfoClick = (event, clientId, clientGroupId) => {
    event.stopPropagation();
    const { ClientManageActions, ClientManageProps } = this.props;
    const selectedItem = ClientManageProps.listData.find(function(element) {
      return element.clientId == clientId;
    });

    ClientManageActions.showDialog({
      selectedItem: Object.assign({}, selectedItem),
      dialogType: ClientDialog.TYPE_VIEW,
      dialogOpen: true
    });
  };

  handleSelectAllClick = (event, checked) => {
    console.log('checked : ', checked);
    const { ClientManageActions, ClientManageProps } = this.props;
    const newSelected = ClientManageProps.listData.map(n => n.clientId)
    ClientManageActions.changeStoreData({
      name: 'selected',
      value: newSelected
    });
  };

  handleChangeGroupSelected = (param) => {
    const { ClientGroupProps, ClientManageProps, ClientManageActions } = this.props;

    console.log(' handleChangeGroupSelected : ', ClientGroupProps.selected);
    console.log(' handleChangeGroupSelected : ', param);

    console.log('ClientManageActions: ',ClientManageActions);
    ClientManageActions.readClientList(getMergedListParam(ClientManageProps.listParam, {groupId: param.join(',')}));
  };

  handleChangeGroupSelect = (event, property) => {
    console.log(' handleChangeGroupSelect : ', property);
  };
  handleChangeClientStatusSelect = (event, property) => {
    console.log(' handleChangeClientStatusSelect : ', property);
  };

  render() {

    //const { data, order, orderBy, selected, rowsPerPage, page, rowsTotal, rowsFiltered } = this.state;
    const { ClientManageProps } = this.props;
    //const emptyRows = rowsPerPage - data.length;
    const emptyRows = 0;// = ClientManageProps.listParam.rowsPerPage - ClientManageProps.listData.length;


    return (
      <React.Fragment>
        <GrPageHeader path={this.props.location.pathname} />
        <GrPane>
          <form className={formClass}>
          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          >그룹등록</Button>
          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          >그룹삭제</Button>
          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          >그룹정책변경</Button>

          <div className={formEmptyControlClass} />

          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          ><SearchIcon className={leftIconClass} />조회</Button>
          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          ><SearchIcon className={leftIconClass} />조회</Button>
          <Button
            className={classNames(buttonClass, formControlClass)}
            variant="outlined" color="primary"
            onClick={() => this.handleSelectBtnClick({page: 0})}
          ><SearchIcon className={leftIconClass} />조회</Button>
          </form>
          <Grid container spacing={24} style={{border:"1px solid red",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              <Card style={{minWidth:"240px"}}>
                <ClientGroupComp 
                  onChangeGroupSelected={this.handleChangeGroupSelected}
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card style={{minWidth:"710px"}}>
              <ClientManageComp 
                  onChangeClientSelected={this.handleChangeGroupSelected}
                />
              </Card>
            </Grid>
          </Grid>
        </GrPane>
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientManageProps: state.ClientManageModule,
  ClientGroupProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientManageActions: bindActionCreators(ClientManageActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientMasterManage);

