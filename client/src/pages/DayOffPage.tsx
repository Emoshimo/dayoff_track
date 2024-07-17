import React, { useEffect, useState } from "react";
import EmployeeDayOff from "../components/EmployeePageComponents/EmployeeDayOff";
import useEmployeeStore from "../stores/employeeStore";
import {
  fetchApprovedEmployeeDayOffs,
  fetchPendingEmployeeDayOffs,
  fetchRejectedEmployeeDayOffs,
} from "../api";
import DayOffList from "../components/DayOffPageComponents/DayOffList";
import { DayOffRequest } from "../interfaces/interfaces";

const DayOffPage = () => {
  const {
    pendingDayOffs,
    updatePendingDayOffs,
    updateApprovedDayOffs,
    updateRejectedDayOffs,
  } = useEmployeeStore();
  const [allRequestsList, setAllRequestsList] = useState<DayOffRequest[]>([]);

  const [, setPopupMessage] = useState<string | null>(null);
  const id = localStorage.getItem("id");
  const { clientEmployee } = useEmployeeStore();
  const token = localStorage.getItem("token");

  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const fetchDayOffs = async () => {
    const [pendingResponse, approvedResponse, rejectedResponse] =
      await Promise.all([
        fetchPendingEmployeeDayOffs(Number(id!), token!, showError),
        fetchApprovedEmployeeDayOffs(Number(id!), token!, showError),
        fetchRejectedEmployeeDayOffs(Number(id!), token!, showError),
      ]);

    let combinedList: DayOffRequest[] = [];

    if (pendingResponse.success) {
      updatePendingDayOffs(pendingResponse.data!);
      combinedList = combinedList.concat(pendingResponse.data!);
    }
    if (approvedResponse.success) {
      updateApprovedDayOffs(approvedResponse.data!);
      combinedList = combinedList.concat(approvedResponse.data!);
    }
    if (rejectedResponse.success) {
      updateRejectedDayOffs(rejectedResponse.data!);
      combinedList = combinedList.concat(rejectedResponse.data!);
    }
    setAllRequestsList(combinedList);
  };
  useEffect(() => {
    fetchDayOffs();
  }, []);

  return (
    <div>
      {pendingDayOffs ? (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col justify-around">
            <DayOffList
              dayOffs={allRequestsList}
              title="My Day Off Requests"
              employee={clientEmployee!}
            />
          </div>
        </div>
      ) : (
        <p>Loading employee details...</p>
      )}
    </div>
  );
};

export default DayOffPage;
