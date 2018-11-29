import React, {Component} from 'react';

import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import { ResponsivePie } from '@nivo/pie'

import Typography from '@material-ui/core/Typography';

class ClientOnOff extends Component {
    
    handleClickChart = (e) => {
        this.props.onLinkClick('client');
    }

    render() {
        const {clientOn, clientOff, clientRevoke} = this.props;

        const colors = ['hsl(257, 70%, 50%)', 'hsl(7, 70%, 50%)', 'hsl(160, 70%, 50%)'];
        const data = [
            {
              "id": "on",
              "label": "On",
              "value": Number(clientOn),
              "color": colors[0]
            },
            {
              "id": "off",
              "label": "Off",
              "value": Number(clientOff),
              "color": colors[1]
            },
            {
              "id": "revoke",
              "label": "Revoke",
              "value": Number(clientRevoke),
              "color": colors[2]
            }
        ];

        return (
            <div style={{height:220}}>

            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
            {/**
                Client <font style={{color:colors[0]}}>On</font>/<font style={{color:colors[1]}}>Off</font>/<font style={{color:colors[2]}}>Revoke</font>
            */}
                Client Status
            </Typography>
            <ResponsivePie
                data={data}
                margin={{
                    "top": 50,
                    "right": 50,
                    "bottom": 50,
                    "left": 50
                }}
                startAngle={-90}
                endAngle={90}
                innerRadius={0.2}
                padAngle={0.7}
                cornerRadius={2}
                colors="green_blue"
                colorBy="id"
                borderWidth={1}
                borderColor="inherit:darker(1)"
                radialLabel="value"
                radialLabelsSkipAngle={0}
                radialLabelsTextXOffset={0}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={21}
                radialLabelsLinkHorizontalLength={0}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="inherit"
                sliceLabel="id"
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                defs={[
                    {
                        "id": "dots",
                        "type": "patternDots",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "size": 4,
                        "padding": 1,
                        "stagger": true
                    },
                    {
                        "id": "lines",
                        "type": "patternLines",
                        "background": "inherit",
                        "color": "rgba(255, 255, 255, 0.3)",
                        "rotation": -45,
                        "lineWidth": 6,
                        "spacing": 10
                    }
                ]}
                fill={[
                    { "match": { "id": "on" }, "id": "lines"},
                    { "match": { "id": "off" }, "id": "dots"},
                    { "match": { "id": "revoke" }, "id": "lines"}
                ]}
                onClick={this.handleClickChart}
            />
            </div>
        );
    }
}

export default ClientOnOff;
