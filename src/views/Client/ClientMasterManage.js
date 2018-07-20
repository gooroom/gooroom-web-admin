import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as ClientMasterManageActions from 'modules/ClientMasterManageModule';
import * as ClientManageCompActions from 'modules/ClientManageCompModule';
import * as ClientGroupActions from 'modules/ClientGroupModule';
import * as ClientConfSettingActions from 'modules/ClientConfSettingModule';
import * as GrConfirmActions from 'modules/GrConfirmModule';

import { createMuiTheme } from '@material-ui/core/styles';
import { css } from 'glamor';

import { formatDateToSimple } from 'components/GrUtils/GrDates';
import { getMergedObject, arrayContainsArray } from 'components/GrUtils/GrCommonUtils';

import { grRequestPromise } from "components/GrUtils/GrRequester";
import GrPageHeader from "containers/GrContent/GrPageHeader";
import GrPane from 'containers/GrContent/GrPane';

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
import GetAppIcon from '@material-ui/icons/GetApp';
import DescIcon from '@material-ui/icons/Description';

import Checkbox from "@material-ui/core/Checkbox";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

// option components
import ClientGroupSelect from '../Options/ClientGroupSelect';
import ClientStatusSelect from '../Options/ClientStatusSelect';



import ClientManageComp from '../Client/ClientManageComp';
import ClientManageInform from '../Client/ClientManageInform';

import ClientGroupComp from '../ClientGroup/ClientGroupComp';
import ClientGroupInform from '../ClientGroup/ClientGroupInform';

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
  minWidth: "33px !important",
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
  height: "min-content",
  padding: "0px !important"
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

  handleSelectBtnClick = (param) => {
    const { ClientManageCompActions, ClientManageCompProps } = this.props;
    ClientManageCompActions.readClientList(getMergedObject(ClientManageCompProps.listParam, param));
  };


  // Select Group Item
  handleChangeClientGroupSelected = (selectedGroupObj='', selectedGroupIdArray) => {

    const { ClientMasterManageProps, ClientMasterManageActions, ClientConfSettingActions } = this.props;
    const { ClientGroupCompProps, ClientGroupActions } = this.props;
    const { ClientManageCompProps, ClientManageCompActions } = this.props;

    ClientManageCompActions.readClientList(getMergedObject(ClientManageCompProps.listParam, {
      groupId: selectedGroupIdArray.join(','), 
      page:0,
      compId: this.props.match.params.grMenuId
    }));

    // show group info.
    if(selectedGroupObj !== '') {
      ClientMasterManageActions.closeClientManageInform();
      ClientGroupActions.setSelectedItemObj({
        compId: this.props.match.params.grMenuId,
        selectedItem: selectedGroupObj
      });

      // Show inform
      ClientMasterManageActions.showClientGroupInform();
    }
  };

  // Select Client Item
  handleChangeClientSelected = (selectedClientObj='', selectedClientIdArray) => {

    const { ClientMasterManageProps, ClientMasterManageActions } = this.props;
    const { ClientManageCompProps, ClientManageCompActions } = this.props;

    // show client info.
    if(selectedClientObj !== '') {

      ClientMasterManageActions.closeClientGroupInform();
      ClientManageCompActions.setSelectedItemObj({
        compId: this.props.match.params.grMenuId,
        selectedItem: selectedClientObj
      });
      ClientMasterManageActions.showClientManageInform();

    }
  };

  render() {

    const { ClientMasterManageProps, ClientGroupCompProps, ClientManageCompProps } = this.props;
    const emptyRows = 0;// = ClientManageCompProps.listParam.rowsPerPage - ClientManageCompProps.listData.length;

    const { isGroupInformOpen, isClientInformOpen } = ClientMasterManageProps;
    const selectedGroupItem = ClientGroupCompProps[this.props.match.params.grMenuId + '__selectedItem'];
    const selectedClientItem = ClientManageCompProps[this.props.match.params.grMenuId + '__selectedItem'];

    // console.log('selectedGroupItem : ', selectedGroupItem);

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
          ><GetAppIcon className={leftIconClass} />조회</Button>
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
          <Grid container spacing={24} style={{border:"0px solid red",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              <Card style={{minWidth:"240px",boxShadow:"2px 2px 8px blue"}}>
                <ClientGroupComp 
                  compId={this.props.match.params.grMenuId}
                  onChangeGroupSelected={this.handleChangeClientGroupSelected}
                />
              </Card>
            </Grid>
            <Grid item xs>
              <Card style={{minWidth:"710px",boxShadow:"2px 2px 8px green"}}>
              <ClientManageComp compId={this.props.match.params.grMenuId}
                  onChangeClientSelected={this.handleChangeClientSelected}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={24} style={{marginTop:"0px",minWidth:"990px"}}>
            <Grid item xs={4} sm={3}>
              {(isGroupInformOpen) &&
              <GetAppIcon className={leftIconClass} />
              }
            </Grid>
            <Grid item xs style={{textAlign:"right"}}>
              {(ClientManageCompProps.informOpen) &&
              <GetAppIcon className={leftIconClass} />
              }
            </Grid>
          </Grid>
          
          <ClientGroupInform
            compId={this.props.match.params.grMenuId}
            isOpen={isGroupInformOpen} 
            selectedItem={selectedGroupItem}
            compShadow="2px 2px 8px blue" 
          />
          <ClientManageInform 
            isOpen={isClientInformOpen}
            selectedItem={selectedClientItem}
            compShadow="2px 2px 8px green" 
          />
          
        </GrPane>
      </React.Fragment>
      
    );
  }
}

const mapStateToProps = (state) => ({
  ClientMasterManageProps: state.ClientMasterManageModule,
  ClientManageCompProps: state.ClientManageCompModule,
  ClientGroupCompProps: state.ClientGroupModule
});

const mapDispatchToProps = (dispatch) => ({
  ClientMasterManageActions: bindActionCreators(ClientMasterManageActions, dispatch),
  ClientManageCompActions: bindActionCreators(ClientManageCompActions, dispatch),
  ClientGroupActions: bindActionCreators(ClientGroupActions, dispatch),
  ClientConfSettingActions: bindActionCreators(ClientConfSettingActions, dispatch),
  GrConfirmActions: bindActionCreators(GrConfirmActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientMasterManage);

