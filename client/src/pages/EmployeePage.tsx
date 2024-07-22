import React, { useEffect, useState } from "react";
import useEmployeeStore from "../stores/employeeStore";
import EmployeeDetails from "../components/EmployeePageComponents/EmployeeDetails";
import { fetchEmployeeDetails } from "../api";

const EmployeePage = () => {
  const [, setPopupMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const { clientEmployee, updateClientEmployee } = useEmployeeStore();
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    if (!clientEmployee?.id) {
      const userDetailsResponse = await fetchEmployeeDetails(
        Number(id!),
        token!,
        showError
      );

      if (userDetailsResponse.success) {
        const clientEmployeeData = {
          id: userDetailsResponse.data?.id,
          name: userDetailsResponse.data?.name,
          surname: userDetailsResponse.data?.surname,
          managerId: userDetailsResponse.data?.managerId,
          remainingDayOffs: userDetailsResponse.data?.remainingDayOffs,
          
        };
        updateClientEmployee(clientEmployeeData);
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      {clientEmployee?.id ? (
        <div className="flex flex-col gap-12">
          <EmployeeDetails employee={clientEmployee} />
        </div>
      ) : (
        <p>Loading employee details...</p>
      )}
    </div>
  );
};

export default EmployeePage;
