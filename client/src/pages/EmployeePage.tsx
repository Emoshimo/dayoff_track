import React, { useEffect, useState } from "react";
import useEmployeeStore from "../stores/employeeStore";
import EmployeeDetails from "../components/EmployeePageComponents/EmployeeDetails";
import { fetchRemainingDayOffs } from "../apicalls/employeeApi";
import { fetchEmployeeDetails } from "../apicalls/employeeApi";

const EmployeePage = () => {
  const [, setPopupMessage] = useState<string | null>(null);
  const [remainingDayOff, setRemainigDayOff] = useState<number>(0);
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
          supervisorId: userDetailsResponse.data?.supervisorId,
          startDate: userDetailsResponse.data?.startDate,
          departmentName: userDetailsResponse.data?.departmentName
        };
        updateClientEmployee(clientEmployeeData);
      }
    }
  };
  const getRemainingDayOff = async () => {
    const remainingDayOff = await fetchRemainingDayOffs(Number(id))
    setRemainigDayOff(remainingDayOff);
  }
  useEffect(() => {
    fetchUser();
    getRemainingDayOff();
  }, []);

  return (
    <div>
      {clientEmployee?.id ? (
        <div className="flex flex-col gap-12">
          <EmployeeDetails employee={clientEmployee} remainingDayOffs={remainingDayOff} />
        </div>
      ) : (
        <p>Loading employee details...</p>
      )}
    </div>
  );
};

export default EmployeePage;
