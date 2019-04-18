import React, {Component} from 'react';

import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import { ResponsivePie } from '@nivo/pie'

import Typography from '@material-ui/core/Typography';

class UserLogin extends Component {

    handleClickChart = (e) => {
        this.props.onLinkClick('user');
    }

    render() {
        const {loginCount, userCnt} = this.props;
        const colors = ['hsl(257, 70%, 50%)', 'hsl(7, 70%, 50%)'];
        const data = [
            {
              "id": "login",
              "label": "Login",
              "value": Number(loginCount),
              "color": colors[0]
            },
            {
              "id": "logout",
              "label": "Logout",
              "value": Number(userCnt - loginCount),
              "color": colors[1]
            }
        ];

        return (
            <div style={{height:220,paddingTop:10}}>

            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
            {/**
                User <font style={{color:colors[0]}}>Login</font>/<font style={{color:colors[1]}}>Logout</font>
             */}
             User Login Status
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
                colors="yellow_orange_brown"
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
                    { "match": { "id": "login" }, "id": "lines"},
                    { "match": { "id": "logout" }, "id": "dots"}
                ]}
                onClick={this.handleClickChart}
            />
            </div>
        );
    }
}

export default UserLogin;
