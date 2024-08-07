import axios from "axios";
import {
  ApiResponse,
  ClientEmployee,
  DayOffType,
} from "../interfaces/interfaces";

const baseURL = "http://localhost:8080/api";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleApiError = <T>(
  error: any,
  showError: (message: string) => void
): ApiResponse<T> => {
  let message = "";
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      message =
        "Network error: Unable to reach the server. Please try again later.";
    } else {
      message = `HTTP error: ${error.response.status}. ${error.response.data}.`;
    }
  } else {
    message = "An unexpected error occurred. Please try again.";
  }
  showError(message);
  return { success: false, message };
};

export const requestDayOff = async (
  id: number,
  token: string,
  startDate: string,
  endDate: string,
  dayOffTypeId: number,
  showError: (message: string) => void
): Promise<ApiResponse<number> | null> => {

  try {
    const response = await axiosInstance.post(
      `/Employee/dayoff/${id}`,
      { startDate, endDate, dayOffTypeId },
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
): Promise<ApiResponse<number>> => {
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

export const fetchDayOffTypes = async (
  showError: (message: string) => void
): Promise<ApiResponse<DayOffType[]>> => {
  try {
    const response = await axiosInstance.get("/DayOffTypes");
    return {success: true, data: response.data}
  } catch (error) {
    return handleApiError(error, showError);
  }
}
export const searchEmployees = async(
  pageNumber: number,
  pageSize: number,
  nameSearchTerm: string | null,
  surnameSearchTerm: string | null,
  idSearchTerm: number | null,
  managerIdSearchTerm: number | null,
  startDateSearchTerm: string | null,
  orderColumn: string | null,
  sortOrder: string | null,
  showError: (message: string) => void

) => {
  try{
    const response = await axiosInstance.get('/Employee/search', {
      params: {
        pageNumber,
        pageSize,
        nameSearchTerm,
        surnameSearchTerm,
        idSearchTerm,
        managerIdSearchTerm,
        startDateSearchTerm,
        orderColumn,
        sortOrder
      }
    });
    return response.data
  }
  catch (error)
  {
    return handleApiError(error, showError)
  }
 
}