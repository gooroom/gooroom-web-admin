
import React, {Component} from 'react';
import {FormGroup, Row, Col, Input} from 'reactstrap';


class SimpleOption extends Component {

    constructor(props) {
        super(props);

    }

    render() {

        const statusOptions = this.props.statusOption.map((x) => (<option value={x.id} key={x.id}>{x.value}</option>));

        return (
            <div className="grOptionBar">
                <Row>
                <Col xs="1" md="1" className="grOptionLabel">상태구분</Col>
                <Col xs="3" md="3"><Input type="select" name="select" id="select">{statusOptions}</Input></Col>
                <Col xs="1" md="1" className="grOptionLabel">상태구분</Col>
                <Col xs="3" md="3"><Input type="select" name="select" id="select">{statusOptions}</Input></Col>
                <Col xs="1" md="1" className="grOptionLabel">상태구분</Col>
                <Col xs="3" md="3"><Input type="select" name="select" id="select">{statusOptions}</Input></Col>
                </Row>
            </div>
        );
    }
}

export default SimpleOption;

