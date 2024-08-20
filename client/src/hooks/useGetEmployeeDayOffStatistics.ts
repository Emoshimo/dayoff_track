import { useEffect, useState } from "react"
import { ApiResponse, EmployeeDayOffStatistics } from "../interfaces/interfaces"
import { fetchEmployeeDayOffStatistics } from "../apicalls/employeeApi";

export const useGetEmployeeDayOffStatistics = (
    id: number
) => {
    const [dayOffStatistics, setDayOffStatistics] = useState<EmployeeDayOffStatistics>()
    const [loading, setLoading] = useState<boolean>(false);
    const [popupMessage, setPopUpMessage] = useState<string>();
    const showError = (message: string) =>
    {
        setPopUpMessage(message)
    } 
    useEffect (() => {
        const fetchEmployeeStatistics = async() => {
            setLoading(true);
            const response :ApiResponse<EmployeeDayOffStatistics> = await fetchEmployeeDayOffStatistics(id, showError);
            if (response.success)
            {
                setDayOffStatistics(response.data)
            }
            setLoading(false);
        }
        fetchEmployeeStatistics();
    }, [id])

    return {dayOffStatistics, loading, popupMessage};
}