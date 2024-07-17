import React, { useEffect, useState } from "react";
import { evaluateDayOff, fetchDayOffsForManager } from "../../api";
import {
  DayOffRequest,
  DayOffRequestForManager,
} from "../../interfaces/interfaces";
import EmployeeDayOffItem from "./EmployeeDayOffItem";

const EmployeeDayOffList = () => {
  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [dayOffRequests, setDayOffRequests] = useState<
    DayOffRequestForManager[]
  >([]);
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const fetchDayOffs = async () => {
    const response = await fetchDayOffsForManager(
      Number(id!),
      token!,
      showError
    );
    console.log(response);
    if (response.data) {
      setDayOffRequests(response.data);
    }
  };
  useEffect(() => {
    fetchDayOffs();
  }, []);

  const handleStatusChange = async (requestId: number, approved: boolean) => {
    const response = await evaluateDayOff(
      requestId,
      token!,
      approved,
      showError
    );
    if (response.success) {
      setDayOffRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold my-4">Employee Day Off Requests</h2>
      {dayOffRequests.length === 0 ? (
        <p>No day off requests found.</p>
      ) : (
        <div className="">
          {dayOffRequests.map((dayOffRequest) => (
            <EmployeeDayOffItem
              key={dayOffRequest.id}
              dayOffRequest={dayOffRequest}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDayOffList;
