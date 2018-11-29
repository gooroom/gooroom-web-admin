import React, {Component} from 'react';

import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import { ResponsivePie } from '@nivo/pie'

import Typography from '@material-ui/core/Typography';

class PackageUpdate extends Component {

    handleClickChart = (e) => {
        this.props.onLinkClick('package');
    }
    
    render() {
        const {noUpdateCount, updateCount, mainUpdateCount} = this.props;

        
        const data = [
            {
              "id": "total",
              "label": "불필요",
              "value": Number(noUpdateCount)
            },
            {
              "id": "update",
              "label": "필요",
              "value": Number(updateCount)
            }
        ];

        return (
            <div style={{height:220}}>

            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
            {/**
                패키지업데이트현황 <font style={{color:colors[0]}}>불필요</font>/<font style={{color:colors[1]}}>필요</font>
            */}
            Package Update Status
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
                colors="blue_green"
                colorBy="value"
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
                sliceLabel="label"
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
                    { "match": { "id": "total" }, "id": "lines"},
                    { "match": { "id": "update" }, "id": "dots"}
                ]}
                onClick={this.handleClickChart}
            />
            </div>
        );
    }
}

export default PackageUpdate;
