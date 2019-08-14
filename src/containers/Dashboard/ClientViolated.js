import React, {Component} from 'react';
import {PieChart, Pie, Legend, ResponsiveContainer} from 'recharts';
import Typography from '@material-ui/core/Typography';

class ClientViolated extends Component {
    
    render() {
        const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}]

        return (
            <div>

            <Typography style={{margin:'2px 8px'}}>Client Violated</Typography>
            <ResponsiveContainer width='100%' height={160} >
            <PieChart margin={{top:5, right:5, bottom:5, left:5}}>
                <Pie startAngle={180} endAngle={0}
                    data={data} dataKey="value" 
                    cy='90%' outerRadius={80} fill="#8884d8" label />
            </PieChart>
            </ResponsiveContainer>


            </div>
        );
    }
}

export default ClientViolated;
