import React, { useEffect, useState } from 'react'
import { fetchTopDayOffEmployees } from '../apicalls/employeeApi'
import { EmployeeDayOffs } from '../interfaces/interfaces';
import TopBarChart from '../components/AnalyticsPageComponents/TopBarChart';
import ChartSelector from '../components/AnalyticsPageComponents/ChartSelector';

const AnalyticsPage = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [employeeDayOffs, setEmployeeDayOffs] = useState<EmployeeDayOffs[]>([])
  const [topX, setTopX] = useState<number>(5);
  const [timePeriod, setTimePeriod] = useState<string>("month");

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const token = localStorage.getItem("token");

  const getEmployeeDayOffs = async () => {
    const employeeDayOffsList = await fetchTopDayOffEmployees(token!, timePeriod, topX, showError);
    if (employeeDayOffsList.success === true && employeeDayOffsList.data) {
      // Combine name and surname
      const updatedData = employeeDayOffsList.data.map(employee => ({
        ...employee,
        fullName: `${employee.name} ${employee.surname}`,
      }));
      setEmployeeDayOffs(updatedData);
    }
  };

  useEffect(() => {
    getEmployeeDayOffs();
  }, [topX, timePeriod]);

  return (
    <div>
      <header className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-primary text-2xl font-semibold">Analytics Page</h3>
      </header>
      <div className="flex flex-col gap-6">
        <ChartSelector topX={topX} setTopX={setTopX} timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        {employeeDayOffs.length > 0 && <TopBarChart data={employeeDayOffs} />}
        {popupMessage && <div className="text-red-500">{popupMessage}</div>}
      </div>
    </div>
  )
}

export default AnalyticsPage