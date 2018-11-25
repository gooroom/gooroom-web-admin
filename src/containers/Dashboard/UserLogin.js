import React, {Component} from 'react';
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import Typography from '@material-ui/core/Typography';

class UserLogin extends Component {
    
    render() {
        const data = [{name: 'Login', value: 143}, {name: 'Logout', value: 293}];
        const colors = ['#0088FE', '#00C49F', '#FFBB28'];

        return (
            <div>
            <Typography style={{margin:'2px 8px',fontWeight:'bold'}}>
                User <font style={{color:colors[0]}}>Login</font>/<font style={{color:colors[1]}}>Logout</font>
            </Typography>

            <ResponsiveContainer width='100%' height={160} >
            <PieChart margin={{top:5, right:5, bottom:5, left:5}}>
                <Pie startAngle={180} endAngle={0}
                    data={data} dataKey="value" 
                    cy='90%' outerRadius={80} fill="#8884d8" label >
                    { data.map((entry, index) => <Cell key={index} fill={colors[index]}/>) }
                </Pie>
            </PieChart>
            </ResponsiveContainer>


            </div>
        );
    }
}

export default UserLogin;
