import React, {Component} from 'react';
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";

import routes from '../../routes';
import {CardHeader} from 'material-ui/Card';

const styles = {
    root: {
        paddingBottom: 0
    }
};

class GrPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {classes} = this.props;
        const routeName = routes[this.props.path];

        return (
            <CardHeader title={routeName} className={classes.root}>
            </CardHeader>
        )
    }
}

GrPageHeader.propTypes = {
    classes: PropTypes.object.isRequired
  };
  export default withStyles(styles)(GrPageHeader);