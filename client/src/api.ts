import axios from "axios";
import {
  ApiResponse,
  ClientEmployee,
  DayOffRequest,
  DayOffRequestForManager,
  IDepartment,
  IEmployee,
  ILoginDTO,
  LoginResponse,
} from "./interfaces/interfaces";

const baseURL = "https://localhost:7237/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = <T>(
  error: any,
  showError: (message: string) => void
): ApiResponse<T> => {
  let message = "";
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      message =
        "Network error: Unable to reach the server. Please try again later.";
    } else {
      message = `HTTP error: ${error.response.status}. ${error.response.data.message}.`;
    }
  } else {
    message = "An unexpected error occurred. Please try again.";
  }
  showError(message);
  return { success: false, message };
};

export const login = async (
  loginData: ILoginDTO,
  showError: (message: string) => void
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const response = await axiosInstance.post("/Account/login", loginData);
    if (response.data.flag) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error: any) {
    return handleApiError(error, showError);
  }
};

export const register = async (
  employeeDTO: IEmployee,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.post(
      "/Account/register",
      employeeDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const fetchEmployees = async (
  token: string,
  showError: (message: string) => void
) => {
  try {
    const response = await axiosInstance.get(`/Employee/all`, {
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

export const fetchPendingEmployeeDayOffs = async (
  id: number,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequest[]>> => {
  try {
    const response = await axiosInstance.get(`/Employee/dayoff/pending/${id}`, {
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
      `/Employee/dayoff/approved/${id}`,
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
      `/Employee/dayoff/rejected/${id}`,
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

export const requestDayOff = async (
  id: number,
  token: string,
  startDate: string,
  endDate: string,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequest> | null> => {
  try {
    const response = await axiosInstance.post(
      `/Employee/dayoff/${id}`,
      { startDate, endDate },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: "Day off requested.",
      };
    }
    return null;
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const cancelDayOff = async (
  ids: number[],
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await axiosInstance.patch(`/Employee/dayoff/cancel`, ids, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Day off requests are cancelled.",
      };
    }
    return {
      success: false,
      message: "Error occured while processing cancellation.",
    };
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const evaluateDayOff = async (
  id: number,
  token: string,
  approved: boolean,
  showError: (message: string) => void
): Promise<ApiResponse<DayOffRequestForManager>> => {
  try {
    const response = await axiosInstance.post(
      `/Manager/dayoff/${id}`,
      approved,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response);
    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: `${approved} Evaluation is done.`,
      };
    }
    return { success: false, message: "Failed to evaluate request." };
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const createDepartment = async (
  iDepartment: IDepartment,
  token: string,
  showError: (message: string) => void
) => {
  try {
    const response = await axiosInstance.post(`/Department`, iDepartment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error, showError);
  }
};

export const fetchDepartments = async (
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<IDepartment>> => {
  try {
    const response = await axiosInstance.get("/Department", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return {
        success: true,
        data: response.data,
        message: "Listing Departments.",
      };
    }
    return { success: false, message: "Error fetching departments." };
  } catch (error) {
    return handleApiError(error, showError);
  }
};
export const editDepartment = async (
  id: number,
  editedDepartment: IDepartment,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<IDepartment>> => {
  try {
    const response = await axiosInstance.put(
      `/Department/${id}`,
      editedDepartment,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Department successfulyl edited.",
      };
    }
    return {
      success: false,
      message: `Error Ocurred while editing Department, HTTP: ${response.status}`,
    };
  } catch (error) {
    console.log(error);
    return handleApiError(error, showError);
  }
};

export const editEmployee = async (
  id: number,
  editedEmployee: ClientEmployee,
  token: string,
  showError: (message: string) => void
): Promise<ApiResponse<ClientEmployee>> => {
  try {
    const response = await axiosInstance.patch(
      `/Account/edit/${id}`,
      editedEmployee,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        message: "Employee successfully edited.",
      };
    }
    return { success: false, message: "Error occured while editing employee." };
  } catch (error) {
    return handleApiError(error, showError);
  }
};
