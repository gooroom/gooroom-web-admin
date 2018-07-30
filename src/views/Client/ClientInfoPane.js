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


class ClientInfoPane extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      clientId: props.clientId,
      clientStatus: "",
      clientName: "",
      clientGroupName: "",
      prodNo: "",
      clientIp: "",
      regDate: "",
      modDate: ""
    }

  }

  componentDidMount() {

    grRequestPromise("https://gpms.gooroom.kr/gpms/readClientInfo", {
      clientId: this.state.clientId
    }).then(res => {
        if(res.data && res.data.length > 0) {
          this.setState({
            clientId: res.data[0].clientId,
            clientStatus: res.data[0].clientStatus,
            clientName: res.data[0].clientName,
            clientGroupName: res.data[0].clientGroupName,
            prodNo: res.data[0].prodNo,
            clientIp: res.data[0].clientIp,
            regDate: res.data[0].regDate,
            modDate: res.data[0].modDate
          });
        }
    });
  }

  render() {

    const { clientInfo } = this.props;

    return (

      <Table >
      <TableBody>
        <TableRow hover>
          <TableCell>단말아이디</TableCell>
          <TableCell >
            {this.state.clientId}
          </TableCell>
          <TableCell>단말상태</TableCell>
          <TableCell >
            {this.state.clientStatus}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell>단말이름</TableCell>
          <TableCell >
            {this.state.clientName}
          </TableCell>
          <TableCell>단말그룹</TableCell>
          <TableCell >
            {this.state.clientGroupName}
            <Settings className={iconClass} />
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell>제품번호</TableCell>
          <TableCell colSpan={3} >
            {this.state.prodNo}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell>단말아이피</TableCell>
          <TableCell colSpan={3} >
            {this.state.clientIp}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell>등록일</TableCell>
          <TableCell >
            {this.state.regDate}
          </TableCell>
          <TableCell>수정일</TableCell>
          <TableCell >
            {this.state.modDate}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    );
  }

}

export default ClientInfoPane;
