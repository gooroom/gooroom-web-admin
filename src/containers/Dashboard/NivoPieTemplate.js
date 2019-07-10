import React, {Component} from 'react';

import { ResponsivePie } from '@nivo/pie'

import Typography from '@material-ui/core/Typography';

class NivoPieTemplate extends Component {
    
    render() {
        const data = [
            {
              "id": "erlang",
              "label": "erlang",
              "value": 95,
              "color": "hsl(265, 70%, 50%)"
            },
            {
              "id": "elixir",
              "label": "elixir",
              "value": 414,
              "color": "hsl(7, 70%, 50%)"
            },
            {
              "id": "hack",
              "label": "hack",
              "value": 17,
              "color": "hsl(160, 70%, 50%)"
            },
            {
              "id": "c",
              "label": "c",
              "value": 233,
              "color": "hsl(257, 70%, 50%)"
            },
            {
              "id": "scala",
              "label": "scala",
              "value": 318,
              "color": "hsl(90, 70%, 50%)"
            }
          ];
          
        return (
            <div style={{height:300}}>
            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
                Nivo Pie
            </Typography>

            <ResponsivePie
                data={data}
                margin={{
                    "top": 10,
                    "right": 10,
                    "bottom": 50,
                    "left": 10
                }}
                startAngle={90}
                endAngle={-90}
                innerRadius={0.2}
                padAngle={0.7}
                cornerRadius={2}
                colors="green_blue"
                colorBy="id"
                borderWidth={1}
                borderColor="inherit:darker(1)"
                radialLabelsSkipAngle={0}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="inherit"
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
                    { "match": { "id": "ruby" }, "id": "dots"},
                    { "match": { "id": "c" }, "id": "dots"},
                    { "match": { "id": "go" }, "id": "dots"},
                    { "match": { "id": "python" }, "id": "lines"},
                    { "match": { "id": "scala" }, "id": "lines"},
                    { "match": { "id": "lisp" }, "id": "dots"},
                    { "match": { "id": "elixir" }, "id": "dots"},
                    { "match": { "id": "javascript" }, "id": "lines"}
                ]}
                legends={[
                    {
                        "anchor": "bottom",
                        "direction": "row",
                        "translateY": 56,
                        "itemWidth": 100,
                        "itemHeight": 18,
                        "itemTextColor": "#999",
                        "symbolSize": 18,
                        "symbolShape": "circle",
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemTextColor": "#000"
                                }
                            }
                        ]
                    }
                ]}
            />
            </div>
        );
    }
}

export default NivoPieTemplate;
