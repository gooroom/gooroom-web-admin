import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {withStyles} from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%'
    },
    grLogo: {
        width: '172px'
    },
    grToggleButton: {
        width: '36px'
    },
    flex: {
        flex: 1
    },
    flex: {
        flex: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
});

class Navbar extends Component {
    render() {
        const {classes} = this.props;

        return (
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography className={classes.grLogo} type="title" color="inherit">Gooroom v1.2</Typography>
                    <IconButton className={classes.grToggleButton} color="default" onClick={this.props.toggleDrawer}><MenuIcon /></IconButton>
                    <div className={classes.flex} color="default" ></div>
                    <IconButton className={classes.menuButton} color="inherit" onClick={this.props.login}><AccountCircle /></IconButton>
                </Toolbar>
            </AppBar>
        )
    }
}

Navbar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Navbar);