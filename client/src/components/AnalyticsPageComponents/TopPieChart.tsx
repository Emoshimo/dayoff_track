import React from 'react'
import { EmployeeDayOffs } from '../../interfaces/interfaces';
import { Cell, Legend, Pie, PieChart } from 'recharts';
import { Tooltip } from '@material-tailwind/react';

interface TopEmployeesChartProps {
    data: EmployeeDayOffs[];
}

const getRandomColor = () => {
    const letters = '013456789ABCDF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p>{`${payload[0].name}: ${payload[0].value} days`}</p>
            </div>
        );
    }
    return null;
};

const TopPieChart: React.FC<TopEmployeesChartProps> = ({ data }) => {
    return (
        <PieChart width={730} height={250} >
            <Pie data={data} dataKey="days" nameKey="fullName" cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => entry.fullName}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />

        </PieChart>
    )
}

export default TopPieChart