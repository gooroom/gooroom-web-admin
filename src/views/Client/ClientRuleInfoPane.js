import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { grRequestPromise } from "components/GrUtils/GrRequester";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core/Table";

import Button from "@material-ui/core/Button";
import Settings from "@material-ui/icons/Settings";

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

      <Table>
          <TableBody>
            <TableRow hover>
              <TableCell>정책이름</TableCell>
              <TableCell >
                {this.state.ruleName}
              </TableCell>
              <TableCell>정책아이디</TableCell>
              <TableCell >
                {this.state.ruleId}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell>정책설명</TableCell>
              <TableCell colSpan={3} >
                {this.state.ruleComment}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell>Agent Polling</TableCell>
              <TableCell >
                {this.state.pollingValue}
              </TableCell>
              <TableCell>운영체제보호</TableCell>
              <TableCell >
                {this.state.useHyperVisor}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

    );

  }

}

export default ClientRuleInfoPane;
