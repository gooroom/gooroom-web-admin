import React, {Component} from 'react';

import GRPane from 'containers/GRContent/GRPane';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class Login extends Component {

    render() {
        const { classes } = this.props;

        return (
            <GRPane>

                <Typography>LOGIN222</Typography>
                

            </GRPane>
        );
        
    }
}

export default withStyles(GRCommonStyle)(Login);
