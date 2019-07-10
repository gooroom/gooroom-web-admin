import React, {Component} from 'react';

import { ResponsiveBar } from '@nivo/bar'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';
import { GRCommonStyle } from 'templates/styles/GRStyles';

class ViolatedStatus extends Component {

    render() {
        const { classes, statusInfo, periodType } = this.props;
        let data = [];
        if(statusInfo) {
            statusInfo.map((n) => {
                data.push({
                    logDate: n.get('logDate'),
                    logDateStr: n.get('logDateStr'),
                    boot: n.get('bootProtectorCount'),
                    exe: n.get('exeProtectorCount'),
                    media: n.get('mediaProtectorCount'),
                    os: n.get('osProtectorCount')
                })
            })
        }

        return (
            <div style={{height:220,paddingTop:10}}>
            <Grid container spacing={0} >
                <Grid item xs={6}>
                    <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>Client Violated {(periodType == 'day') ? "Daily":((periodType == 'week') ? "Weekly":((periodType == 'month') ? "Monthly":""))} Count</Typography>
                </Grid>
                <Grid item xs={6} style={{textAlign:'right'}}>
                    <Button className={classes.GRIconSmallButton} style={{minWidth:25,marginRight:10}}
                        variant="contained" color={(periodType == 'day') ? "secondary":"primary"} 
                        onClick={() => this.props.onChangeType('day')} >D</Button>
                    <Button className={classes.GRIconSmallButton} style={{minWidth:25,marginRight:10}}
                        variant="contained" color= {(periodType == 'week') ? "secondary":"primary"} 
                        onClick={() => this.props.onChangeType('week')} >W</Button>
                    <Button className={classes.GRIconSmallButton} style={{minWidth:25,marginRight:10}}
                        variant="contained" color={(periodType == 'month') ? "secondary":"primary"} 
                        onClick={() => this.props.onChangeType('month')} >M</Button>
                </Grid>
            </Grid>
            {(statusInfo && statusInfo.size > 0) &&
            <ResponsiveBar
                data={data}
                keys={[
                    "boot",
                    "exe",
                    "os",
                    "media"
                ]}

                indexBy="logDateStr"
                margin={{
                    "top": 20,
                    "right": 96,
                    "bottom": 60,
                    "left": 40
                }}
                padding={0.2}
                minValue={0}
                groupMode="grouped"
                colors="nivo"
                colorBy="id"
                defs={[
                    {
                        "id": "dots",
                        "type": "patternDots",
                        "background": "inherit",
                        "color": "#38bcb2",
                        "size": 4,
                        "padding": 1,
                        "stagger": true
                    },
                    {
                        "id": "lines",
                        "type": "patternLines",
                        "background": "inherit",
                        "color": "#eed312",
                        "rotation": -45,
                        "lineWidth": 6,
                        "spacing": 10
                    }
                ]}
                fill={[
                    {
                        "match": {
                            "id": "exe"
                        },
                        "id": "dots"
                    },
                    {
                        "match": {
                            "id": "media"
                        },
                        "id": "lines"
                    }
                ]}
                borderColor="inherit:darker(1.6)"
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                legends={[
                    {
                        "dataFrom": "keys",
                        "anchor": "bottom-right",
                        "direction": "column",
                        "justify": false,
                        "translateX": 120,
                        "translateY": 0,
                        "itemsSpacing": 2,
                        "itemWidth": 100,
                        "itemHeight": 10,
                        "itemDirection": "left-to-right",
                        "itemOpacity": 0.85,
                        "symbolSize": 10
                    }
                ]}
            />
            }
            </div>
        );
    }
}

export default withStyles(GRCommonStyle)(ViolatedStatus);
