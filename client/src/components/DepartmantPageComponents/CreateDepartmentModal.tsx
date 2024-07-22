import React from "react";
import RegisterDepartment from "./RegisterDepartment";

interface CreateDepartmentProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateDepartmentModal: React.FC<CreateDepartmentProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }
  const handleBackgroundCLick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40"
      onClick={handleBackgroundCLick}
    >
      <div className="flex justify-center rounded-lg w-full max-w-xl">
        <RegisterDepartment />
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
