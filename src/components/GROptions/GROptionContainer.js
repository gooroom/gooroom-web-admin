
import React, {Component} from 'react';
//import {Form, FormGroup, Row, Col, Input, InputGroup, InputGroupAddon, Button, Label, Card, CardBody} from 'reactstrap';

import GrButton from '../../components/GrOptions/GrButton';

import Select from 'material-ui/Select';

class GrOptionContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: ''
        };
    }

    testFunction() {
        return 'Hello...';
    }

    render() {

        const labelRate = this.props.labelWidthRate;
        const valueRate = this.props.valueWidthRate;
        const optionLabel = this.props.optionLabel;
        //const optionItems = '';//this.props.optionItems.map((x) => (<option value={x.id} key={x.id}>{x.value}</option>));

        const options = this.props.options;

        const optionItems = options.map((option) => {
            switch(option.type) {
                case 'select':
                    return (
                        <FormGroup key={option.id} className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for={option.id} className="mr-sm-2 grOptionLabel">{option.label}</Label>
                            <Input type="select" name={option.id} id={option.id}>
                            {option.selectItems.map(x => (
                                <option value={x.id} key={x.id}>
                                  {x.value}
                                </option>
                            ))}
                            </Input>
                        </FormGroup>
                    );
                    break;
                case 'radio':
                    return 'radio';
                    break;
                case 'input':
                    return 'input';
                    break;
                case 'button':
                    return (
                        <FormGroup key={option.id} className="mb-2 mr-sm-2 mb-sm-0">
                            <GrButton align="right" label="그룹등록" onClick={option.toggleCreateDialog}/>
                        </FormGroup>
                    );
                    break;
                case 'input-search':
                    return (
                        <FormGroup key={option.id} className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for={option.id} className="mr-sm-2 grOptionLabel">{option.label}</Label>
                            <InputGroup>
                            <Input id={option.id} size="16" type="text"/>
                            <InputGroupAddon addonType="append">
                                <Button color="success">검색</Button>
                            </InputGroupAddon>
                            </InputGroup>
                        </FormGroup>
                    );
                    break;
                default:
                    return '';
                    break;
            }
        });

        return (
            <Card>
                <CardBody className="grOptionBar">
                    <Form inline>
                        {optionItems}
                    </Form>
                </CardBody>
            </Card>
       );
    }
}

export default GrOptionContainer;

