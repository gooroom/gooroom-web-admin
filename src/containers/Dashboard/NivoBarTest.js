import React, {Component} from 'react';

import { ResponsiveBar } from '@nivo/bar'

import Typography from '@material-ui/core/Typography';

class NivoBarTest extends Component {
    render() {
        const data = [
            {
              "date": "11/01",
              "boot": 49,
              "os": 9,
              "exe": 45,
              "media": 126
            },
            {
              "date": "11/02",
              "boot": 117,
              "os": 9,
              "exe": 93,
              "media": 99
            },
            {
              "date": "11/03",
              "boot": 119,
              "os": 0,
              "exe": 47,
              "media": 89
            },
            {
              "date": "11/04",
              "boot": 9,
              "os": 32,
              "exe": 55,
              "media": 78
            },
            {
              "date": "11/05",
              "boot": 9,
              "os": 73,
              "exe": 55,
              "media": 45
            },
            {
              "date": "11/06",
              "boot": 9,
              "os": 55,
              "exe": 55,
              "media": 34
            },
            {
              "date": "11/07",
              "boot": 9,
              "os": 23,
              "exe": 55,
              "media": 76
            }
          ];
          
        return (
            <div style={{height:220}}>
            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
                Nivo Pie
            </Typography>

            <ResponsiveBar
                data={data}
                keys={[
                    "boot",
                    "os",
                    "exe",
                    "media"
                ]}
                indexBy="date"
                margin={{
                    "top": 50,
                    "right": 96,
                    "bottom": 50,
                    "left": 60
                }}
                padding={0.3}
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
                        "anchor": "top-right",
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
            </div>
        );
    }
}

export default NivoBarTest;
