import React, {Component} from 'react';
import PropTypes from "prop-types";

import CardHeader from '@material-ui/core/CardHeader';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GrPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { name, classes } = this.props;
//        console.log('GrPageHeader..................................name..', name);

        return (
            <CardHeader title={name} className={classes.menuHeaderRoot}>GrPageHeader
            </CardHeader>
        )
    }
}

export default withStyles(GrCommonStyle)(GrPageHeader);