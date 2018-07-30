import React, {Component} from 'react';
import PropTypes from "prop-types";

import routes from 'routes';
import CardHeader from '@material-ui/core/CardHeader';

import { withStyles } from '@material-ui/core/styles';
import { GrCommonStyle } from 'templates/styles/GrStyles';

class GrPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const routeName = routes[this.props.path];

        return (
            <CardHeader title={routeName} className={classes.menuHeaderRoot}>GrPageHeader
            </CardHeader>
        )
    }
}

export default withStyles(GrCommonStyle)(GrPageHeader);