import React, { Component } from "react";
import PropTypes from "prop-types";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withTheme } from "@material-ui/core/styles";

import { css } from "glamor";

import Dialog, {DialogTitle, DialogActions } from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Typography from '@material-ui/core/Typography';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from "@material-ui/core/Card";

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


//
//  ## Dialog ########## ########## ########## ########## ##########
//
class ClientGroupDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: ""
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.onClose("test");
    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      }

    render() {
        const {onClose, ...other} = this.props;

        return (
            <Dialog
                onClose={this.handleClose}
                {...other}
            >
                <DialogTitle className={titleClass}>단말그룹등록</DialogTitle>

                <form noValidate autoComplete="off" className={containerClass}>

                    <TextField
                    id="groupName"
                    label="단말그룹이름"
                    value={this.state.groupName}
                    onChange={this.handleChange('groupName')}
                    margin="normal"
                    className={fullWidthClass}
                    />

                    <TextField
                    id="groupComment"
                    label="단말그룹설명"
                    value={this.state.groupComment}
                    onChange={this.handleChange('groupComment')}
                    margin="normal"
                    className={fullWidthClass}
                    />

                    <Card className={ruleContainerClass}>
                    <CardContent className={ruleContentClass}>
                    <Typography component="p">
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                    This impressive paella is a perfect party dish and a fun meal to cook together with
                    your guests. Add 1 cup of frozen peas along with the mussels, if you like.
</Typography>
                  </CardContent>
                    
                    </Card>

                </form>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default withTheme()(ClientGroupDialog);

