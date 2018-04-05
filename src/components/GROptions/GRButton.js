
import React, {Component} from 'react';
//import {FormGroup, Input, InputGroup, InputGroupAddon, Button} from 'reactstrap';


class GrButton extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Button color="success" onClick={this.props.onClick}>{this.props.label}</Button>{''}
            </div>
        );
    }
}

export default GrButton;

