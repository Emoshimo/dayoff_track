import React, { useState } from "react";
import PopUp from "../PopUp";

const CreateDepartmentModal = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const fetchPossibleManagers = () => {};
  const [departmentData, setDepartmentData] = useState({
    Name: "",
    ManagerId: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDepartmentData({ ...departmentData, [name]: value });
  };

  return (
    <div className="w-1/2 mx-auto p-8 bg-primary rounded-xl text-slate-200 shadow-md">
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-bold text-2xl">Create Department</h2>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="name">
            Department Name:
          </label>
          <input
            id="name"
            name="Name"
            className="p-2 border rounded-lg w-full text-lg"
            type="text"
            placeholder="Enter Your Name"
            value={departmentData.Name}
            onChange={handleChange}
          />
        </div>

        <div className="w-full text-primary">
          <label className="text-slate-200" htmlFor="managerId">
            ManagerId:
          </label>
          <input
            id="managerId"
            name="ManagerId"
            className="p-2 border rounded-lg w-full text-lg"
            type="number"
            placeholder="Enter Your Surname"
            value={departmentData.ManagerId}
            onChange={handleChange}
          />
        </div>

        <button
          className={`bg-second text-white rounded hover:bg-blue-600 
            lg:px-32 lg:py-3 lg:text-xl
            sm:px-6 sm:py-1 sm:text-lg sm:rounded-xl `}
        >
          Register
        </button>
        {popupMessage && (
          <PopUp message={popupMessage} onClose={handleClosePopup} />
        )}
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
