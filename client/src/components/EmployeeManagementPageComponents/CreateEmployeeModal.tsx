import React from "react";
import Register from "../Register";

interface CreateEmployeeProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen!) {
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
        <Register />
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
