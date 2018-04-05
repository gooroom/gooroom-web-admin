import React, {Component} from 'react';
import routes from '../../routes';
import {CardHeader} from 'material-ui/Card';

class GrPageHeader extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const routeName = routes[this.props.path];
        return (
            <CardHeader title={routeName}>
            </CardHeader>
        )
    }
}

export default GrPageHeader;
