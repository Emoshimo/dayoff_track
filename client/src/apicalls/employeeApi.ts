import { ApiResponse, ClientEmployee, DayOffRequest, DayOffRequestForManager, EmployeeDayOffs } from "../interfaces/interfaces";
import { axiosInstance, handleApiError } from "./api";


export const fetchEmployees = async (
  pageNumber: number,
  pageSize: number,
  token: string,
  showError: (message: string) => void
) => {
  try {
    const response = await axiosInstance.get(`/Employee/pagination?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const fetchPossibleManagers = async (id: number) => {
  const response = await axiosInstance.get(`/Employee/possible_managers/${id}`);
  if (response.status === 200) {
    return response.data;
  }
};
export const fetchEmployeeDetails = async (
  id: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<ClientEmployee>> => {
  try {
    const response = await axiosInstance.get(`/Employee/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const returnData = response.data;
      return { success: true, data: returnData };
    }
    return { success: false, message: response.data.message };
  } catch (error: any) {
    return handleApiError(error, showError);
  }
};
export const fetchRemainingDayOffs = async (
  id: number
) => {
  const response = await axiosInstance.get(`/Employee/${id}/remaining_day_off`);
  if (response.status === 200) {
    return response.data;
  }
};

export const fetchPendingEmployeeDayOffs = async (
  id: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequest[]>> => {
  try {
    const response = await axiosInstance.get(`/DayOffRequest/dayoff/pending/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const dayOffsData = response.data;
      const formattedDayOffs = dayOffsData.map((dayOff: any) => {
        const formattedDate = new Date(dayOff.startDate);
        const formattedEndDate = new Date(dayOff.endDate);

        return {
          id: dayOff.id,
          employeeId: dayOff.employeeId,
          pendingManagerId: dayOff.pendingManagerId,
          status: dayOff.status,
          startDate: formattedDate,
          endDate: formattedEndDate,
        };
      });
      return { success: true, data: formattedDayOffs };
    } else {
      return { success: false, message: "Failed to fetch day offs." };
    }
  } catch (error) {
    return handleApiError(error, showError);
  }
};
export const fetchApprovedEmployeeDayOffs = async (
  id: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequest[]>> => {
  try {
    const response = await axiosInstance.get(
      `/DayOffRequest/dayoff/approved/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      const dayOffsData = response.data;
      const formattedDayOffs = dayOffsData.map((dayOff: any) => {
        const formattedDate = new Date(dayOff.startDate);
        const formattedEndDate = new Date(dayOff.endDate);
        return {
          id: dayOff.id,
          employeeId: dayOff.employeeId,
          managerId: dayOff.managerId,
          status: dayOff.status,
          startDate: formattedDate,
          endDate: formattedEndDate,
        };
      });
      return { success: true, data: formattedDayOffs };
    } else {
      return { success: false, message: "Failed to fetch day offs." };
    }
  } catch (error) {
    return handleApiError(error, showError);
  }
};
export const fetchRejectedEmployeeDayOffs = async (
  id: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequest[]>> => {
  try {
    const response = await axiosInstance.get(
      `/DayOffRequest/dayoff/rejected/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      const dayOffsData = response.data;
      const formattedDayOffs = dayOffsData.map((dayOff: any) => {
        const formattedDate = new Date(dayOff.startDate);
        const formattedEndDate = new Date(dayOff.endDate);
        return {
          id: dayOff.id,
          employeeId: dayOff.employeeId,
          managerId: dayOff.managerId,
          status: dayOff.status,
          startDate: formattedDate,
          endDate: formattedEndDate,
        };
      });
      return { success: true, data: formattedDayOffs };
    } else {
      return { success: false, message: "Failed to fetch day offs." };
    }
  } catch (error) {
    return handleApiError(error, showError);
  }
};
export const fetchDayOffsForManager = async (
  managerId: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequestForManager[]>> => {
  try {
    const response = await axiosInstance.get(`/Manager/dayoff/${managerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const dayOffsData = response.data;
      const formattedDayOffs = dayOffsData.map(
        (dayOff: DayOffRequestForManager) => {
          const formattedStartDate = new Date(dayOff.startDate);
          const formattedEndDate = new Date(dayOff.endDate);
          return {
            id: dayOff.id,
            employeeName: dayOff.employeeName,
            employeeSurname: dayOff.employeeSurname,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          };
        }
      );
      return {
        success: true,
        data: formattedDayOffs,
        message: "Listing requests pending your approval.",
      };
    }
    return { success: false, message: "Failed to fetch day offs." };
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const fetchTopDayOffEmployees = async (
  token: string,
  timePeriod: string,
  topX: number,
  showError: (message: string) => void
): Promise<ApiResponse<EmployeeDayOffs[]>> => {
  const response = await axiosInstance.get(`Employee/top_employees?timePeriod=${timePeriod}&topX=${topX}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (response.status === 200)
  {
    console.log(response.data)
    return {success: true, data: response.data};
  }
  else {
    return handleApiError(response.data.message, showError);
  }
}
