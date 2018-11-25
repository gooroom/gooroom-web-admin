import React, {Component} from 'react';
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import Typography from '@material-ui/core/Typography';

class ClientOnOff extends Component {
    
    render() {
        const data = [{name: 'On', value: 400}, {name: 'Off', value: 300}, {name: 'Revoke', value: 80}];
        const colors = ['#0088FE', '#00C49F', '#FFBB28'];

        return (
            <div>

            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
                Client <font style={{color:colors[0]}}>On</font>/<font style={{color:colors[1]}}>Off</font>/<font style={{color:colors[2]}}>Revoke</font>
            </Typography>
            <ResponsiveContainer width='100%' height={160} >
            <PieChart margin={{top:5, right:5, bottom:5, left:5}}>
                <Pie startAngle={180} endAngle={0}
                    data={data} dataKey="value" 
                    cy='90%' outerRadius={80} fill="#8884d8" label>
                    { data.map((entry, index) => <Cell key={index} fill={colors[index]}/>) }
                </Pie>
            </PieChart>
            </ResponsiveContainer>


            </div>
        );
    }
}

export default ClientOnOff;
