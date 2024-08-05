import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EmployeeDayOffs } from '../../interfaces/interfaces';

interface TopEmployeesChartProps {
    data: EmployeeDayOffs[];
}
const TopBarChart: React.FC<TopEmployeesChartProps> = ({ data }) => {
    console.log(data)
    return (
        <BarChart
            width={1400}
            height={400}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}

        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fullName" angle={-45} textAnchor='end' interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="days" fill="#002A56" barSize={50} />

        </BarChart>

    );
}

export default TopBarChart