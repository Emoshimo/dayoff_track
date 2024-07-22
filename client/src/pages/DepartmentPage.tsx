import React, { useState } from "react";
import DepartmentList from "../components/DepartmantPageComponents/DepartmentList";
import CreateDepartmentModal from "../components/DepartmantPageComponents/CreateDepartmentModal";

const DepartmentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <header className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-primary text-2xl font-semibold">
          Departments Table
        </h3>
        <button
          className="text-primary flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full"
          onClick={openModal}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </button>
        <CreateDepartmentModal isOpen={isModalOpen} onClose={closeModal} />
      </header>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col justify-around">
          <DepartmentList />
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
