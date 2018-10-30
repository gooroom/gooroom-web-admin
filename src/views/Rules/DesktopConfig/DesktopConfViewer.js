import React, { Component } from "react";

import PropTypes from "prop-types";
import classNames from "classnames";

import DesktopApp from './DesktopApp';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class DesktopConfViewer extends Component {

  render() {

    const { classes, viewItem } = this.props;

    let appPaneWidth = 0;
    if(viewItem && viewItem.get('apps') && viewItem.get('apps').size > 0) {
      appPaneWidth = viewItem.get('apps').size * (120 + 16) + 40;
    }

    return (
      <React.Fragment>
        {(viewItem) && 
          <Card elevation={0} className={classes.ruleViewerCard}>
            <CardContent style={{padding: 10}}>
            <Grid container>
              <Grid item xs={6}>
                <Typography color="default">
                {(viewItem.get('confNm') != '') ? viewItem.get('confNm') : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
              </Grid>
            </Grid>
            <Divider />

              <div style={{overflowY: 'auto'}}>
                <Grid container spacing={16} direction="row" justify="flex-start" alignItems="flex-start" style={{width:appPaneWidth,margin:20}}>
                  {viewItem.get('apps') && viewItem.get('apps').map(n => {
                    return (
                      <Grid key={n.get('appId')} item>
                        <DesktopApp 
                            key={n.get('appId')}
                            appObj={n}
                            themeId={viewItem.get('themeId')}
                          />
                      </Grid>
                    );
                  })}
                </Grid>
              </div>

            </CardContent>
          </Card>
        }
      </React.Fragment>
    );
  }
}

export default withStyles(GRCommonStyle)(DesktopConfViewer);
