import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopUp from "../PopUp";
import { requestDayOff } from "../../api";
import { ClientEmployee } from "../../interfaces/interfaces";

interface EmployeeDayOffProps {
  employee: ClientEmployee;
  onClose: () => void;
}

const EmployeeDayOff: React.FC<EmployeeDayOffProps> = ({
  employee,
  onClose,
}) => {
  const token = localStorage.getItem("token");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const handleTakeDayOff = async () => {
    if (endDate < startDate) {
      showError("Invalid dates.");
      return;
    }

    const startOfDay = new Date(startDate);
    const endOfDay = new Date(endDate);

    const startYear = startOfDay.getFullYear();
    const startMonth = String(startOfDay.getMonth() + 1).padStart(2, "0");
    const startDay = String(startOfDay.getDate()).padStart(2, "0");
    const startFullDate = `${startYear}-${startMonth}-${startDay}`;
    const endYear = endOfDay.getFullYear();
    const endMonth = String(endOfDay.getMonth() + 1).padStart(2, "0");
    const endDay = String(endOfDay.getDate()).padStart(2, "0");
    const endFullDate = `${endYear}-${endMonth}-${endDay}`;
    const response = await requestDayOff(
      employee.id!,
      token!,
      startFullDate,
      endFullDate,
      showError
    );
    if (response?.success) {
      onClose();
    }
    console.log(response);
  };
  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      <div className="flex flex-row gap-4">
        <div className="block">
          <label className="block mb-2 text-lg font-bold text-gray-800">
            Starting Date:
          </label>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date!)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date"
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none text-center"
            />
          </div>
        </div>
        <div className="block">
          <label className="block mb-2 text-lg font-bold text-gray-800">
            Ending Date:
          </label>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date!)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date"
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none text-center"
            />
          </div>
        </div>
      </div>
      <h4>Remaining Day Off: {employee.remainingDayOffs}</h4>

      <hr className="my-6 border-gray-300" />
      <button
        className="block w-full py-3 text-lg font-bold text-white bg-primary rounded-lg shadow-lg hover:bg-hover focus:outline-none focus:bg-blue-600"
        onClick={handleTakeDayOff}
      >
        Take Day Off
      </button>
      {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default EmployeeDayOff;
