import React, {Component} from 'react';

import { ResponsivePie } from '@nivo/pie'

import Typography from '@material-ui/core/Typography';

class NivoPieTest extends Component {
    render() {
        const data = [
            {
              "id": "boot",
              "label": "신뢰부팅",
              "value": 95,
              "color": "hsl(265, 70%, 50%)"
            },
            {
              "id": "os",
              "label": "운영체제보호",
              "value": 414,
              "color": "hsl(7, 70%, 50%)"
            },
            {
              "id": "exe",
              "label": "실행파일보호",
              "value": 17,
              "color": "hsl(160, 70%, 50%)"
            },
            {
              "id": "media",
              "label": "매체제어",
              "value": 233,
              "color": "hsl(257, 70%, 50%)"
            }
          ];
          
        return (
            <div style={{height:220}}>
            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
                Nivo Pie
            </Typography>

            <ResponsivePie
                data={data}
                margin={{
                    "top": 50,
                    "right": 50,
                    "bottom": 50,
                    "left": 50
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
                radialLabel="label"
                radialLabelsSkipAngle={0}
                radialLabelsTextXOffset={0}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={21}
                radialLabelsLinkHorizontalLength={0}
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
            />
            </div>
        );
    }
}

export default NivoPieTest;
