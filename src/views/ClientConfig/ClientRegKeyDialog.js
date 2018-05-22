import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withTheme } from "@material-ui/core/styles";

import { css } from "glamor";

import { grRequestPromise } from "../../components/GrUtils/GrRequester";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
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

    static TYPE_VIEW = 'VIEW';
    static TYPE_ADD = 'ADD';
    static TYPE_EDIT = 'EDIT';

    constructor(props) {
        super(props);

        this.state = {
            regKeyNo: "",
            validDate: "2018-05-20",
            expireDate: "2028-05-31",
            ipRange: "",
            comment: ""
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleAddData = this.handleAddData.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleKeyGenerate = this.handleKeyGenerate.bind(this);

        this.handleRegKeyData = props.handleRegKeyData.bind(this);
    }

    handleRegKeyData() {

    }

    handleClose() {
        this.props.onClose("close");
    }

    handleAddData() {
        grRequestPromise("http://localhost:8080/gpms/createRegKeyData", 
            this.props.selectedData
          ).then(res => {
              this.handleClose();
          }, res => {
            this.handleClose();
        });        
    }

    handleSaveData() {
        grRequestPromise("http://localhost:8080/gpms/editRegKeyData", 
            this.props.selectedData
          ).then(res => {
              this.handleClose();
          }, res => {
            this.handleClose();
        });        
    }

    handleKeyGenerate = () => {
        grRequestPromise("http://localhost:8080/gpms/generateRegKeyNumber", {
          }).then(res => {
              console.log(res);
              this.handleRegKeyData('regKeyNo', res.data[0].key);
            //   this.setState({
            //     regKeyNo: res.data[0].key,
            //   });
          }, res => {
            // this.setState({
            //     regKeyNo: "error",
            //   });
          });        
    }

    handleChange = name => event => {
        this.handleRegKeyData(name, event.target.value);
        // this.setState({
        //   [name]: event.target.value,
        // });
    }

    render() {
        const {onClose, selectedData, type, handleRegKeyData, ...other} = this.props;

        let title = "";
        let buttons = {};
        if(type === ClientRegKeyDialog.TYPE_ADD) {
            title = "단말 등록키 등록";
        } else if(type === ClientRegKeyDialog.TYPE_VIEW) {
            title = "단말 등록키 정보";
        } else if(type === ClientRegKeyDialog.TYPE_EDIT) {
            title = "단말 등록키 수정";
        }

        return (
            <Dialog
                onClose={this.handleClose}
                {...other}
            >
                <DialogTitle className={titleClass}>{title}</DialogTitle>

                <form noValidate autoComplete="off" className={containerClass}>

                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <TextField
                                id="regKeyNo"
                                label="등록키"
                                value={selectedData.regKeyNo}
                                onChange={this.handleChange("regKeyNo")}
                                margin="normal"
                                className={fullWidthClass}
                                disabled 
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
                            style={{display: type === ClientRegKeyDialog.TYPE_ADD ? 'block' : 'none' }}
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
                            value={selectedData.validDate}
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
                            value={selectedData.expireDate}
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
                    value={selectedData.ipRange}
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
                        id="comment"
                        label="설명"
                        margin="normal"
                        onChange={this.handleChange("comment")}
                        className={fullWidthClass}
                        value={selectedData.comment}
                    />

                </form>

                <DialogActions>
                    
                <Button onClick={this.handleAddData} color="secondary" style={{display: type === ClientRegKeyDialog.TYPE_ADD ? 'block' : 'none' }}>등록</Button>
                <Button onClick={this.handleSaveData} color="secondary" style={{display: type === ClientRegKeyDialog.TYPE_EDIT ? 'block' : 'none' }}>저장</Button>
                <Button onClick={this.handleClose} color="primary">닫기</Button>

                </DialogActions>
            </Dialog>
        );
    }

}

export default withTheme()(ClientRegKeyDialog);

