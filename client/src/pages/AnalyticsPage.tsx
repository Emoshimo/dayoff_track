import React, { useEffect, useState } from 'react'
import { fetchTopDayOffEmployees } from '../apicalls/employeeApi'
import { EmployeeDayOffs } from '../interfaces/interfaces';
import TopBarChart from '../components/AnalyticsPageComponents/TopBarChart';
import ChartSelector from '../components/AnalyticsPageComponents/ChartSelector';
import TopPieChart from '../components/AnalyticsPageComponents/TopPieChart';
import useEmployeeStore from '../stores/employeeStore';

const AnalyticsPage = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [employeeDayOffs, setEmployeeDayOffs] = useState<EmployeeDayOffs[]>([])
  const [topX, setTopX] = useState<number>(5);
  const [timePeriod, setTimePeriod] = useState<string>("month");
  const [chartType, setChartType] = useState<string>("BarChart");
  const { clientEmployee } = useEmployeeStore();
  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const token = localStorage.getItem("token");

  const getEmployeeDayOffs = async () => {
    const employeeDayOffsList = await fetchTopDayOffEmployees(clientEmployee?.id!, token!, timePeriod, topX, showError);
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
        <ChartSelector
          topX={topX}
          setTopX={setTopX}
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
          chartType={chartType}
          setChartType={setChartType}
        />
        <div className="flex flex-row justify-center">
          {employeeDayOffs.length > 0 && (
            <>
              {chartType === "BarChart" && <TopBarChart data={employeeDayOffs} />}
              {chartType === "PieChart" && <TopPieChart data={employeeDayOffs} />}
              {/* Add more chart types here as needed */}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage