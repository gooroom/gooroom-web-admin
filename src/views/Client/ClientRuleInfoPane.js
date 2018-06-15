import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from '@material-ui/core/styles';
import { css } from "glamor";

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core/Table";

import Button from "@material-ui/core/Button";
import Settings from "@material-ui/icons/Settings";

//
//  ## Style ########## ########## ########## ########## ##########
//

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#ff4400"
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contast with palette.primary.main
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffcc00"
    }
  }
});

const tableClass = css({
  minWidth: 500
}).toString();

const tableLabelCellClass = css({
  height: "1em !important",
  padding: "5px !important"
}).toString();

const tableContentCellClass = css({
  height: "1em !important",
  padding: "5px !important",
  fontWeight: "bolder"
}).toString();

const iconClass = css({
  marginLeft: "0.5em",
  marginBottom: "-0.3em"
}).toString();


class ClientRuleInfoPane extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      clientGroupId: props.clientGroupId,
      ruleId: "",
      ruleName: "",
      ruleComment: "",
      pollingValue: "",
      useHyperVisor: "",
    }
  }

  componentDidMount() {

    grRequestPromise("https://gpms.gooroom.kr/gpms/readClientConfByGroupId", {
      clientGroupId: this.state.clientGroupId
    }).then(res => {
      if(res.data && res.data.length > 0) {
        const pollingValue = res.data[0].propArray
        ? res.data[0].propArray.find(function(elem) {
            return elem.propNm == "AGENTPOLLINGTIME";
          }).propValue
        : "";
        const useHyperVisor = res.data[0].propArray
        ? res.data[0].propArray.find(function(elem) {
            return elem.propNm == "USEHYPERVISOR";
          }).propValue
        : "";

        this.setState({
          ruleId: res.data[0].objId,
          ruleName: res.data[0].objNm,
          ruleComment: res.data[0].comment,
          pollingValue: pollingValue,
          useHyperVisor: useHyperVisor,
        });
      }
    });

  }

  render() {

    const { clientInfo } = this.props;

    return (

      <Table className={tableClass}>
          <TableBody>
            <TableRow hover>
              <TableCell className={tableLabelCellClass}>정책이름</TableCell>
              <TableCell className={tableContentCellClass}>
                {this.state.ruleName}
              </TableCell>
              <TableCell className={tableLabelCellClass}>정책아이디</TableCell>
              <TableCell className={tableContentCellClass}>
                {this.state.ruleId}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell className={tableLabelCellClass}>정책설명</TableCell>
              <TableCell colSpan={3} className={tableContentCellClass}>
                {this.state.ruleComment}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell className={tableLabelCellClass}>Agent Polling</TableCell>
              <TableCell className={tableContentCellClass}>
                {this.state.pollingValue}
              </TableCell>
              <TableCell className={tableLabelCellClass}>운영체제보호</TableCell>
              <TableCell className={tableContentCellClass}>
                {this.state.useHyperVisor}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

    );

  }

}

export default ClientRuleInfoPane;
