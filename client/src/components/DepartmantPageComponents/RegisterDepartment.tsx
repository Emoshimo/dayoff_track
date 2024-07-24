import React, { useState } from "react";
import PopUp from "../PopUp";
import { createDepartment } from "../../apicalls/departmentApi";
import { IDepartment } from "../../interfaces/interfaces";

const RegisterDepartment = () => {
  const [departmentData, setDepartmentData] = useState<IDepartment>({
    name: "",
    managerId: 0,
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDepartmentData({ ...departmentData, [name]: value });
  };
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const handleCreateDepartment = async () => {
    try {
      const response = await createDepartment(
        departmentData,
        token!,
        showError
      );
      console.log(response);
    } catch (error) {}
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  return (
    <div className="w-2/3 mx-auto px-8 py-16 bg-primary rounded-xl text-slate-200 shadow-md">
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-bold text-2xl">Create Department</h2>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="name">
            Department Name:
          </label>
          <input
            id="name"
            name="name"
            className="p-2 border rounded-lg w-full text-lg"
            type="text"
            placeholder="Enter Name"
            value={departmentData.name}
            onChange={handleChange}
          />
        </div>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="managerId">
            ManagerId:
          </label>
          <input
            id="managerId"
            name="managerId"
            className="p-2 border rounded-lg w-full text-lg"
            type="number"
            placeholder="Enter Manager Id or Leave Empty"
            value={departmentData.managerId}
            onChange={handleChange}
          />
        </div>

        <button
          className={`bg-second text-white rounded hover:bg-blue-600 
          lg:px-12 lg:py-2 lg:text-xl
          sm:px-6 sm:py-1 sm:text-lg sm:rounded-xl `}
          onClick={handleCreateDepartment}
        >
          Create Department
        </button>
        {popupMessage && (
          <PopUp message={popupMessage} onClose={handleClosePopup} />
        )}
      </div>
    </div>
  );
};

export default RegisterDepartment;
