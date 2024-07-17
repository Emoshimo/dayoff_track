import React, { useEffect, useState } from "react";
import { ClientEmployee, DayOffRequest } from "../../interfaces/interfaces";
import { getTitleBackgroundColor } from "../../utils/colorUtils";
import DayOffModal from "./DayOffModal";
import { cancelDayOff } from "../../api";

interface DayOffListProps {
  dayOffs: DayOffRequest[];
  title: string;
  employee: ClientEmployee;
}
type SelectedRows = number[];

const DayOffList: React.FC<DayOffListProps> = ({
  dayOffs,
  title,
  employee,
}) => {
  const [, setPopupMessage] = useState<string | null>(null);
  const [dayOffList, setDayOffList] = useState<DayOffRequest[]>(dayOffs);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const cancelPendingRequests = async () => {
    const response = await cancelDayOff(selectedRows, token!, showError);
    if (response.success) {
      const updatedDayOffList = dayOffList.filter(
        (request) => !selectedRows.includes(request.id)
      );
      setDayOffList(updatedDayOffList);
      setSelectedRows([]);
    }
  };
  useEffect(() => {
    setDayOffList(dayOffs);
    console.log(dayOffs);
  }, [dayOffs]);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <header className="flex flex-row justify-between items-start mr-16">
        <h3 className="text-primary text-xl font-semibold mb-4">{title}</h3>
        <button className="text-4xl" onClick={openModal}>
          <svg
            className="w-8 h-8"
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
          employee={employee}
        />
      </header>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr className="bg-primary text-slate-200">
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Pending Manager</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
            </tr>
          </thead>
          <tbody>
            {dayOffList.map((item) => (
              <tr key={item.id} className="text-center">
                {item.status === "Pending" ? (
                  <td className="border  py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox w-4 h-4 accent-primary"
                      onChange={() => toggleRowSelection(item.id)}
                      checked={selectedRows.includes(item.id)}
                    />
                  </td>
                ) : (
                  <td className="border"></td>
                )}

                <td className="border px-4 py-2">{item.id}</td>
                <td
                  className={`border px-4 py-2 ${getTitleBackgroundColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </td>
                <td className="border px-4 py-2">{item.pendingManagerId}</td>
                <td className="border px-4 py-2">
                  {item.startDate.toDateString()}
                </td>
                <td className="border px-4 py-2">
                  {item.endDate.toDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-row justify-end mx-8">
          <button
            onClick={cancelPendingRequests}
            className="bg-rejected hover:bg-hoverReject px-4 py-2 mt-2 text-3xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayOffList;
