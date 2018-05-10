import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import { withTheme } from "material-ui/styles";

import { css } from "glamor";

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Dialog, {DialogTitle, DialogActions } from "material-ui/Dialog";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";

import Typography from 'material-ui/Typography';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
  } from 'material-ui/Form';
import Grid from 'material-ui/Grid';

import Add from "@material-ui/icons/Add";

//
//  ## Style ########## ########## ########## ########## ##########
//
const theme = createMuiTheme();
const containerClass = css({
    margin: "0px 30px !important",
    minHeight: 500,
    minWidth: 500
}).toString();

const titleClass = css({
    backgroundColor: theme.palette.primary
}).toString();

const fullWidthClass = css({
    width: "100%"
}).toString();

const ruleContainerClass = css({
    height: "346px",
    overflowY: "auto",
    boxShadow: "none !important"
}).toString();

const ruleContentClass = css({
    padding: "5px 5px 24px 0px !important",
}).toString();


const formControlClass = css({
    minWidth: "100px !important",
      marginRight: "15px !important",
      flexGrow: 1
}).toString();

const buttonClass = css({
    margin: theme.spacing.unit + " !important"
}).toString();

const leftIconClass = css({
    marginRight: theme.spacing.unit + " !important"
}).toString();

const keyCreateBtnClass = css({
    paddingTop: 24 + " !important"
}).toString();




//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientRegKeyDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            regKey: "",
            validDate: "2018-05-20",
            expireDate: "2028-05-31",
            ipRange: "",
            keyComment: ""
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleKeyGenerate = this.handleKeyGenerate.bind(this);
    }

    handleClose() {
        this.props.onClose("close");
    }

    handleSaveData() {
        console.log("handleSaveData..");

        grRequestPromise("http://localhost:8080/gpms/createRegKeyData", {
            regkeyNo: this.state.regKey,
            validDate: this.state.validDate,
            expireDate: this.state.expireDate,
            ipRange: this.state.ipRange
          }).then(res => {
              this.handleClose();
          }, res => {
            this.handleClose();
        });        
    }

    handleKeyGenerate() {
        console.log("handleKeyGenerate....");

        grRequestPromise("http://localhost:8080/gpms/generateRegKeyNumber", {
          }).then(res => {
              this.setState({
                regKey: res.data[0].key,
              });
          }, res => {
            this.setState({
                regKey: "error",
              });
          });        
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
    }

    handleChangeValidDate = () => {
        console.log("aaaaaaaa");
    }

    render() {
        const {onClose, ...other} = this.props;

        return (
            <Dialog
                onClose={this.handleClose}
                {...other}
            >
                <DialogTitle className={titleClass}>단말 등록키 추가</DialogTitle>

                <form noValidate autoComplete="off" className={containerClass}>

                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField
                                id="regKey"
                                label="등록키"
                                value={this.state.regKey}
                                onChange={this.handleChange("regKey")}
                                margin="normal"
                                className={fullWidthClass}
                            />
                        </Grid>
                        <Grid item xs={4} className={keyCreateBtnClass}>
                           <Button
                            className={classNames(buttonClass, formControlClass)}
                            variant="raised"
                            color="secondary"
                            onClick={() => {
                                this.handleKeyGenerate();
                            }}
                            ><Add className={leftIconClass} />키생성
                            </Button>
                        </Grid>
                  </Grid>

                    <Grid container spacing={16}>
                        <Grid item xs={6}>
                        <TextField
                            id="validDate"
                            label="유효날짜"
                            type="date"
                            margin="normal"
                            value={this.state.validDate}
                            onChange={this.handleChange("validDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            id="date"
                            label="인증서만료날짜"
                            type="date"
                            margin="normal"
                            value={this.state.expireDate}
                            onChange={this.handleChange("expireDate")}
                            className={fullWidthClass}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />
                        </Grid>
                    </Grid>

                    <TextField
                    id="ipRange"
                    label="유효 IP 범위"
                    value={this.state.ipRange}
                    onChange={this.handleChange("ipRange")}
                    margin="normal"
                    className={fullWidthClass}
                    />
                    <FormLabel disabled={true}>
                        여러개인 경우 콤마(.) 로 구분, 또는 "-" 로 영역 설정 가능합니다.
                    </FormLabel><br />
                    <FormLabel disabled={true}>
                        (샘플) "127.0.0.1, 169.0.0.1" 또는 "127.0.0.1 - 127.0.0.10"
                    </FormLabel>
                    <TextField
                    id="keyComment"
                    label="설명"
                    margin="normal"
                    onChange={this.handleChange("keyComment")}
                    className={fullWidthClass}
                    value={this.state.keyComment}
                    />

                </form>

                <DialogActions>

                    <Button onClick={this.handleSaveData} color="secondary">
                        저장
                    </Button>
        
                    <Button onClick={this.handleClose} color="primary">
                        닫기
                    </Button>

                </DialogActions>
            </Dialog>
        );
    }

}

export default withTheme()(ClientRegKeyDialog);

