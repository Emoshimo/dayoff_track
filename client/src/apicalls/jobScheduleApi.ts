import { AxiosError } from "axios";
import { ApiResponse, JobSchedule } from "../interfaces/interfaces";
import { axiosInstance, handleApiError } from "./api";

export const fetchJobSchedules = async (
    token: string,
    showError: (message: string) => void
) :Promise<ApiResponse<JobSchedule[]>> => {
    const response = await axiosInstance.get("/JobSchedule", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200)
    {
        return {success: true, data: response.data}
    }
    return handleApiError("Internal Server Error: Something Unexpected Occured", showError);
}

export const fetchJobScheduleById = async (
    id: number,
    token: string,
    showError: (message: any) => void
) => {
    try {
        const response = await axiosInstance.get(`/JobSchedule/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }) 
        if (response.status === 200)
        {
            return {success: true, data: response.data}
        }
    } catch (error: any) {
        handleApiError(error, showError)
    }
}

export const updateJobSchedule = async (
    token: string,
    jobSchedule: JobSchedule,
    showError: (message: any) => void
) : Promise<ApiResponse<JobSchedule>> => {
    try {
        const response = await axiosInstance.patch(`/JobSchedule`, jobSchedule, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.status === 200) {
            return { success: true, data: response.data };
          } else {
            return handleApiError(
              { response: { status: response.status, data: response.data } },
              showError
            );
          }

    } catch (error) {
        return handleApiError(error, showError);
    }
}