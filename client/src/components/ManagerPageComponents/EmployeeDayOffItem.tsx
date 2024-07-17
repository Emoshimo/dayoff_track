import React, { useState } from "react";
import { DayOffRequestForManager } from "../../interfaces/interfaces";
import { evaluateDayOff } from "../../api";
import PopUp from "../PopUp";

interface EmployeeDayOffItemProps {
  dayOffRequest: DayOffRequestForManager;
  onStatusChange: (requestId: number, approved: boolean) => void;
}

const EmployeeDayOffItem: React.FC<EmployeeDayOffItemProps> = ({
  dayOffRequest,
  onStatusChange,
}) => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const { id, employeeName, employeeSurname, startDate, endDate } =
    dayOffRequest;
  const token = localStorage.getItem("token");
  const onClickApprove = async () => {
    const res = await evaluateDayOff(id, token!, true, showError);
    if (res?.success) {
      onStatusChange(id, true);
      console.log(res);
    }
  };
  const onClickReject = async () => {
    const res = await evaluateDayOff(id, token!, false, showError);
    if (res.success) {
      onStatusChange(id, false);
    }
    console.log(res);
  };
  return (
    <div className="flex flex-col md:flex-row justify-between bg-white shadow-md rounded-lg p-4 m-2">
      <div className="mb-4 md:mb-0">
        <p className="text-lg font-bold">
          Employee Name: {`${employeeName} `}
          {employeeSurname}
        </p>
        <p>
          Status: <span className="text-pending font-bold">Pending</span>
        </p>
        <p>Day Off Date: {new Date(startDate).toLocaleDateString()}</p>
        <p>Day Off Date: {new Date(endDate).toLocaleDateString()}</p>
      </div>
      <div className="flex flex-row gap-4 justify-center md:justify-end">
        <button
          onClick={onClickApprove}
          className="bg-approved p-2 rounded-md w-full md:w-24 hover:bg-hoverApprove"
        >
          Approve
        </button>
        <button
          onClick={onClickReject}
          className="bg-rejected p-2 rounded-md w-full md:w-24 hover:bg-hoverReject"
        >
          Reject
        </button>
      </div>
      {popupMessage && (
        <PopUp
          message="Failed to evaluate request"
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default EmployeeDayOffItem;
