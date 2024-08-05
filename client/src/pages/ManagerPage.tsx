import React from "react";
import EmployeeDayOffList from "../components/ManagerPageComponents/EmployeeDayOffList";

const ManagerPage = () => {
  const id = localStorage.getItem("token");
  return (
    <div>
      <header className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-primary text-2xl font-semibold">Day Off Table</h3>
      </header>
      <EmployeeDayOffList />
    </div>
  );
};

export default ManagerPage;
