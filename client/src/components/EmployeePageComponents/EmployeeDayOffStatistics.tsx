import React from 'react'
import { useGetEmployeeDayOffStatistics } from '../../hooks/useGetEmployeeDayOffStatistics'
import EmployeeDayOffPieChart from './EmployeeDayOffPieChart';

const EmployeeDayOffStatistics = () => {
    const id = Number(localStorage.getItem("id"));
    const { dayOffStatistics, loading, popupMessage } = useGetEmployeeDayOffStatistics(id!);
    console.log(dayOffStatistics)
    return (
        <div className='flex flex-col bg-white shadow-custom-black rounded-md px-4 py-2'>
            <h2 className="text-primary text-2xl">Day Off Request History </h2>
            <EmployeeDayOffPieChart data={dayOffStatistics} />
        </div>
    )
}

export default EmployeeDayOffStatistics