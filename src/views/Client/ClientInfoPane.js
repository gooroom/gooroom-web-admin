import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createMuiTheme } from "material-ui/styles";
import { css } from "glamor";

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";

import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText
} from "material-ui/Form";

import Button from "material-ui/Button";
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

    grRequestPromise("http://localhost:8080/gpms/readClientInfo", {
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

      <Table className={tableClass}>
      <TableBody>
        <TableRow hover>
          <TableCell className={tableLabelCellClass}>단말아이디</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.clientId}
          </TableCell>
          <TableCell className={tableLabelCellClass}>단말상태</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.clientStatus}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell className={tableLabelCellClass}>단말이름</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.clientName}
          </TableCell>
          <TableCell className={tableLabelCellClass}>단말그룹</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.clientGroupName}
            <Settings className={iconClass} />
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell className={tableLabelCellClass}>제품번호</TableCell>
          <TableCell colSpan={3} className={tableContentCellClass}>
            {this.state.prodNo}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell className={tableLabelCellClass}>단말아이피</TableCell>
          <TableCell colSpan={3} className={tableContentCellClass}>
            {this.state.clientIp}
          </TableCell>
        </TableRow>
        <TableRow hover>
          <TableCell className={tableLabelCellClass}>등록일</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.regDate}
          </TableCell>
          <TableCell className={tableLabelCellClass}>수정일</TableCell>
          <TableCell className={tableContentCellClass}>
            {this.state.modDate}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    );
  }

}

export default ClientInfoPane;
