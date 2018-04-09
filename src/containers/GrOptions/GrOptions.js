import React, {Component} from 'react';
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import classNames from "classnames";

import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

//import {Form, FormGroup, Row, Col, Input, InputGroup, InputGroupAddon, Button, Label, Card, CardBody} from 'reactstrap';

//import GRButton from '../../components/GROptions/GRButton';

const styles = {
    root: {
        minHeight: 60
    },
    formControlNormal: {
      marginRight: "5px",
    },
    formControlDownOne: {
      marginRight: "5px",
      top: 1
    },
    formControlMin80: {
      minWidth: 80,
    },
    formControlMin90: {
      minWidth: 90,
    },
    formControlMin100: {
      minWidth: 100,
    },
    formControlMin110: {
      minWidth: 110,
    },
    formControlMin120: {
      minWidth: 120,
    },
    formControlMin130: {
      minWidth: 130,
    },
    formControlMin140: {
      minWidth: 140,
    },
    formControlMin150: {
      minWidth: 150,
    },
    formControlMin160: {
      minWidth: 160,
    },
    formControlMin170: {
      minWidth: 170,
    },
    formControlMin180: {
      minWidth: 180,
    },
    formControlMin190: {
      minWidth: 190,
    },
    formControlMin200: {
      minWidth: 200,
    },
    control: {
      marginTop: 0,
    }
  };
  
class GrOptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: ''
        };
    }

    render() {
        //console.log("-GrOptions.render-------------------------");
        const { classes } = this.props;

        const labelRate = this.props.labelWidthRate;
        const valueRate = this.props.valueWidthRate;
        const optionLabel = this.props.optionLabel;
        //const optionItems = '';//this.props.optionItems.map((x) => (<option value={x.id} key={x.id}>{x.value}</option>));

        const options = this.props.options;
        const handler = this.props.handler;
        //console.log(options);

        const optionItems = options.map((option) => {
            switch(option.type) {
                case 'select-single':
                    return (
                      <FormControl key={option.id} className={classNames(classes.formControlDownOne, classes.formControlMin120)} noValidate autoComplete="off">
                        <InputLabel htmlFor={option.id}>{option.label}</InputLabel>
                        <Select value={option.valueObject} 
                            onChange={handler}
                            inputProps={{
                                name: option.id,
                                id: option.id,
                            }}
                        >
                        {option.selectItems.map(x => (
                            <MenuItem value={x.value} key={x.id}>{x.label}</MenuItem>
                        ))}
                        </Select>
                      </FormControl>
                    );
                    break;
                default:
                    return <FormControl key={option.id}></FormControl>;
                    break;
            }
        });

        return (
            <div className={classes.root}>
            {optionItems}
            </div>
            
       );
    }
}

GrOptions.propTypes = {
    classes: PropTypes.object.isRequired
  };
  export default withStyles(styles)(GrOptions);

