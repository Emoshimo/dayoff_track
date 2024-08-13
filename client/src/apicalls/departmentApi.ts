import { ApiResponse, ClientEmployee, IDepartment } from "../interfaces/interfaces";
import { axiosInstance, handleApiError } from "./api";


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
      console.log(response.data)
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


