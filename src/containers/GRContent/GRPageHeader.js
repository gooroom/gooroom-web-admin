import React, {Component} from 'react';
import PropTypes from "prop-types";

import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class GRPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { name, classes } = this.props;
        return (
            <Typography variant="h6" gutterBottom className={classes.menuHeaderTitle}>{name}</Typography>
        )
    }
}

export default withStyles(GRCommonStyle)(GRPageHeader);

