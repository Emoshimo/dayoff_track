import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { EmployeeDayOffs } from '../../interfaces/interfaces';

interface TopEmployeesChartProps {
    data: EmployeeDayOffs[];
}
const TopBarChart: React.FC<TopEmployeesChartProps> = ({ data }) => {
    console.log(data)
    return (
        <div className='flex flex-col items-center'>
            <BarChart
                width={600}
                height={300}
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}

            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="days" fill="#002A56" barSize={50} />

            </BarChart>
        </div>

    );
}

export default TopBarChart