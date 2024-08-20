import React from 'react'
import { EmployeeDayOffs } from '../../interfaces/interfaces';
import { Cell, Pie, PieChart } from 'recharts';
import { getRandomColor } from '../../utils/colorUtils';

interface TopEmployeesChartProps {
    data: EmployeeDayOffs[];
}

const TopPieChart: React.FC<TopEmployeesChartProps> = ({ data }) => {
    return (
        <PieChart width={730} height={250} >
            <Pie data={data} dataKey="days" nameKey="fullName" cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ fullName, value }) => `${fullName}: ${value}`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}

            </Pie>

        </PieChart>
    )
}

export default TopPieChart