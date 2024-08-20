import React from 'react'
import { EmployeeDayOffStatistics } from '../../interfaces/interfaces'
import { Cell, Pie, PieChart } from 'recharts';
import { getRandomColor } from '../../utils/colorUtils';

interface EmployeeDayOffPieChartProps {
    data: EmployeeDayOffStatistics | undefined
}

const EmployeeDayOffPieChart: React.FC<EmployeeDayOffPieChartProps> = ({ data }) => {
    const pieData = [
        { name: 'Approved', value: data?.approvedCount },
        { name: 'Rejected', value: data?.rejectedCount },
        { name: 'Pending', value: data?.pendingCount },
        { name: 'Cancelled', value: data?.canceledCount }
    ].filter(entry => entry.value !== undefined && entry.value > 0)

    return (
        <PieChart width={480} height={360}>
            <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value }) => `${name}: ${value}`}
            >
                {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
            </Pie>
        </PieChart>
    )
}

export default EmployeeDayOffPieChart