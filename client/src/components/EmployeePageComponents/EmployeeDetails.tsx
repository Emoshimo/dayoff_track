import React from "react";
import { ClientEmployee } from "../../interfaces/interfaces";

interface Props {
  employee: ClientEmployee;
  remainingDayOffs: number
}
const EmployeeDetails: React.FC<Props> = ({ employee, remainingDayOffs }) => {

  return (
    <div className="bg-white shadow-custom-black   rounded-md p-4">
      <h2 className="text-primary text-2xl">Details</h2>
      <p className="text-primary">ID: <span className="font-bold">{employee.id}</span> </p>
      <p className="text-primary">Name: <span className="font-bold">{employee.name}</span></p>
      <p className="text-primary">Surname: <span className="font-bold">{employee.surname}</span></p>
      <p className="text-primary">
        Remaining Day Offs Number: <span className="font-bold">{remainingDayOffs}</span>
      </p>
      <p className="text-primary">Start Date: <span className="font-bold">{employee.startDate}</span> </p>
      <p className="text-primary">Department: <span className="font-bold">{employee.departmentName ? employee.departmentName : "None"}</span> </p>

    </div>
  );
};

export default EmployeeDetails;
