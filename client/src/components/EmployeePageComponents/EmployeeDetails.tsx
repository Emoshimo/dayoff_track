import React from "react";
import { ClientEmployee } from "../../interfaces/interfaces";

interface Props {
  employee: ClientEmployee;
}
const EmployeeDetails: React.FC<Props> = ({ employee }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h2 className="text-primary text-2xl">Details</h2>
      <p className="text-primary">ID: {employee.id}</p>
      <p className="text-primary">Name: {employee.name}</p>
      <p className="text-primary">Surname: {employee.surname}</p>
      <p className="text-primary">
        Remaining Day Offs Number: {employee.remainingDayOffs}
      </p>
    </div>
  );
};

export default EmployeeDetails;
