import React from "react";
import EmployeeDayOffList from "../components/ManagerPageComponents/EmployeeDayOffList";

const ManagerPage = () => {
  const id = localStorage.getItem("token");
  console.log(id);
  return (
    <div>
      <EmployeeDayOffList />
    </div>
  );
};

export default ManagerPage;
