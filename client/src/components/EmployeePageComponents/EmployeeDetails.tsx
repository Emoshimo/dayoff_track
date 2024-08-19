import React from "react";
import { ClientEmployee } from "../../interfaces/interfaces";

interface Props {
  employee: ClientEmployee;
  remainingDayOffs: number
}
const EmployeeDetails: React.FC<Props> = ({ employee, remainingDayOffs }) => {

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-primary text-2xl">Details</h2>
      <p className="text-primary">ID: {employee.id}</p>
      <p className="text-primary">Name: {employee.name}</p>
      <p className="text-primary">Surname: {employee.surname}</p>
      <p className="text-primary">
        Remaining Day Offs Number: {remainingDayOffs}
      </p>
      <p className="text-primary">Start Date: {employee.startDate}</p>
      <p className="text-primary">Department: {employee.departmentName ? employee.departmentName : "None"}</p>

    </div>
  );
};

export default EmployeeDetails;
