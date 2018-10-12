import React, {Component} from 'react';
import PropTypes from "prop-types";

import CardHeader from '@material-ui/core/CardHeader';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { name, classes } = this.props;
//        console.log('GRPageHeader..................................name..', name);

        return (
            <CardHeader title={name} className={classes.menuHeaderRoot}>GRPageHeader
            </CardHeader>
        )
    }
}

export default withStyles(GRCommonStyle)(GRPageHeader);