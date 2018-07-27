import React, {Component} from 'react';
import PropTypes from "prop-types";

import { css } from 'glamor';

import routes from 'routes';
import CardHeader from '@material-ui/core/CardHeader';


const rootClass = css({
    paddingBottom: 0,
  }).toString();
  
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
        const routeName = routes[this.props.path];

        return (
            <CardHeader title={routeName} className={rootClass}>
            </CardHeader>
        )
    }
}

export default GrPageHeader;