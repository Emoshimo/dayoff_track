import { useEffect, useState } from "react";
import { fetchDepartmentEmployees } from "../apicalls/departmentApi";
import { ApiResponse, ClientEmployee, PaginationResponse } from "../interfaces/interfaces";


export const useGetDepartmentEmployees = (
    token: string,
    managerId: number,
    pageSize: number,
    pageNumber: number,

    showError: (message: string) => void
  ) => {
    const [employees, setEmployees] = useState<ClientEmployee[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);

  
    useEffect(() => {
      const fetchEmployees = async () => {
        setLoading(true);
  
        const response: ApiResponse<PaginationResponse> = await fetchDepartmentEmployees(
            token,
            managerId,
            pageSize,
            pageNumber,
            showError
          );
  
          if (response.success) {
            setEmployees(response.data!.employees);
            setTotalPages(response.data!.totalPageNumber)
          } else {
            showError(response.message!);
          }
         setLoading(false)
      };
  
      fetchEmployees();
    }, [token, pageSize, pageNumber]);
  
    return { employees, loading, totalPages };
  };