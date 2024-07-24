export interface IEmployee {
  Name: string;
  Surname: string;
  DayOffNumber: number;
  EmailAddress: string;
  Password: string;
  ConfirmPassword: string;
  StartDate: string | null
}
export interface ClientEmployee {
  id?: number;
  name?: string;
  surname?: string;
  managerId?: number;
  remainingDayOffs?: number;
}

export interface IDepartment {
  id?: number;
  name?: string;
  managerId?: number;
}

export interface ILoginDTO {
  EmailAddress: string;
  Password: string;
}

export interface LoginResponse {
  flag: boolean;
  token: string | null;
  message: string;
  id: number | null;
}

export interface DayOffRequest {
  id: number;
  employeeId: number;
  pendingManagerId: number;
  dayOffTypeId: number | null,
  status: string;
  startDate: Date;
  endDate: Date;
}

export interface DayOffRequestForManager {
  id: number;
  employeeName: string;
  employeeSurname: string;
  startDate: Date;
  endDate: Date;
}

export interface DayOffType {
  id: number,
  name: string
}

export interface JobSchedule {
  id: number,
  jobKey: string,
  cronExpression: string,
  isActive: boolean,
  group: string
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
