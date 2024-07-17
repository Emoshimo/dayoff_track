import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import CreateEmployeeModal from "./CreateEmployeeModal";

const RegisterEmployee = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <header className="flex justify-between text-2xl font-bold mx-8">
        <h1>Employee List</h1>
        <button onClick={openModal}>Add</button>
        <CreateEmployeeModal isOpen={isModalOpen} onClose={closeModal} />
      </header>
      <EmployeeList />
    </div>
  );
};

export default RegisterEmployee;
