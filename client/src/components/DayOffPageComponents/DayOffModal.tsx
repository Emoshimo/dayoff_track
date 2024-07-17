import React from "react";
import EmployeeDayOff from "../EmployeePageComponents/EmployeeDayOff";
import { ClientEmployee } from "../../interfaces/interfaces";

interface DayOffModalProps {
  isOpen: boolean;
  employee: ClientEmployee;
  onClose: () => void;
}

const DayOffModal: React.FC<DayOffModalProps> = ({
  isOpen,
  onClose,
  employee,
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
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <EmployeeDayOff employee={employee} onClose={onClose} />
      </div>
    </div>
  );
};

export default DayOffModal;
