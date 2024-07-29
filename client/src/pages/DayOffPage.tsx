import React, { useEffect, useState } from "react";
import EmployeeDayOff from "../components/DayOffPageComponents/EmployeeDayOff";
import useEmployeeStore from "../stores/employeeStore";
import { fetchRejectedEmployeeDayOffs } from "../apicalls/employeeApi";
import { fetchApprovedEmployeeDayOffs } from "../apicalls/employeeApi";
import { fetchPendingEmployeeDayOffs } from "../apicalls/employeeApi";
import DayOffList from "../components/DayOffPageComponents/DayOffList";
import { DayOffRequest } from "../interfaces/interfaces";
import DayOffModal from "../components/DayOffPageComponents/DayOffModal";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
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
      <header className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-primary text-2xl font-semibold">Day Off Table</h3>
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
        <DayOffModal
          isOpen={isModalOpen}
          onClose={closeModal}
          employee={clientEmployee!}
        />
      </header>
      {pendingDayOffs ? (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col justify-around">
            <DayOffList dayOffs={allRequestsList} />
          </div>
        </div>
      ) : (
        <p>Loading employee details...</p>
      )}
    </div>
  );
};

export default DayOffPage;
