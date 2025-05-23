import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopUp from "../PopUp";
import { fetchDayOffTypes, requestDayOff } from "../../apicalls/api";
import { fetchRemainingDayOffs } from "../../apicalls/employeeApi";
import { ClientEmployee, DayOffType } from "../../interfaces/interfaces";

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
  const [dayOffTypes, setDayOffTypes] = useState<DayOffType[]>([]);
  const [selectedDayOffTypeId, setSelectedDayOffTypeId] = useState<number | null>(null);
  const [remainingDayOff, setRemainingDayOff] = useState<number>(0);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [newRemainingDays, setNewRemainingDays] = useState<number | null>(
    (1) | 0
  );

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const handleClosePopup = () => {
    setPopupMessage(null);
  };

  const calculateNewRemainingDays = (start: Date, end: Date) => {
    if (!start || !end) return;

    const startOfDay = new Date(start);
    const endOfDay = new Date(end);

    // Helper function to count the number of weekends between two dates
    const countWeekends = (startDate: Date, endDate: Date) => {
      let count = 0;
      let currentDate = new Date(startDate);
      currentDate.setHours(0, 0, 0, 0);

      while (currentDate <= endDate) {
        const day = currentDate.getDay();
        if (day === 0 || day === 6) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return count;
    };

    const differenceInMilliseconds = endOfDay.getTime() - startOfDay.getTime();
    const totalDays = differenceInMilliseconds / (1000 * 3600 * 24) + 1;
    const weekends = countWeekends(startOfDay, endOfDay);
    const differenceInDays = totalDays - weekends;

    // Use Math.floor to round down to the nearest integer
    const roundedDifferenceInDays = Math.floor(differenceInDays);

    setNewRemainingDays(Math.floor(remainingDayOff - roundedDifferenceInDays));
  };

  const onDateChange = (date: Date | null) => {
    if (!date) return;
    setEndDate(date);
    calculateNewRemainingDays(startDate, date); // Update newRemainingDays when either date changes
  };

  const handleTakeDayOff = async () => {
    if (endDate < startDate) {
      showError("Invalid dates.");
      return;
    }
    if (!selectedDayOffTypeId) {
      showError("You have to choose a day off type.");
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
      selectedDayOffTypeId!,
      showError
    );
    if (response?.success) {
      onClose();
    }
    console.log(response);
  };

  const fetchTypes = async () => {
    const result = await fetchDayOffTypes(showError);
    if (result.success) {
      console.log(result.data);
      setDayOffTypes(result.data!);
    }
  };
  const getRemainingDayOff = async () => {
    const result = await fetchRemainingDayOffs(employee.id!);
    setRemainingDayOff(result);
    console.log(result)
  }
  const handleDayOffTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDayOffTypeId(value ? Number(value) : null);
  };

  useEffect(() => {
    getRemainingDayOff();
    fetchTypes();
    calculateNewRemainingDays(startDate, endDate);
  }, [])

  // Update newRemainingDays when startDate changes
  useEffect(() => {
    calculateNewRemainingDays(startDate, endDate);
  }, [startDate]);

  // Update newRemainingDays when remainingDayOff changes
  useEffect(() => {
    calculateNewRemainingDays(startDate, endDate);
  }, [remainingDayOff]);
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
              onChange={(date) => onDateChange(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date"
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none text-center"
            />
          </div>
        </div>
      </div>
      <div className="block mb-4">
        <label className="block mb-2 text-lg font-bold text-gray-800">
          Day Off Type:
        </label>
        <select
          value={selectedDayOffTypeId || ""}
          onChange={handleDayOffTypeChange}
          className="w-full px-4 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="" disabled>Select Day Off Type</option>
          {dayOffTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <h4>Remaining Day Off: {remainingDayOff}</h4>
      <h4>New Remaining Day Off: {newRemainingDays}</h4>

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
