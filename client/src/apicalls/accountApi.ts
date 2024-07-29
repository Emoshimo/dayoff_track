import { ILoginDTO, ApiResponse, LoginResponse, IEmployee } from "../interfaces/interfaces";
import { axiosInstance, handleApiError } from "./api";


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
    console.log(error);
    return handleApiError(error, showError);
  }
};

