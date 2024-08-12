import React, { useEffect, useState } from "react";
import { DayOffRequest } from "../../interfaces/interfaces";
import { getTitleBackgroundColor } from "../../utils/colorUtils";
import { cancelDayOff } from "../../apicalls/api";

interface DayOffListProps {
  dayOffs: DayOffRequest[];
}
type SelectedRows = number[];

const DayOffList: React.FC<DayOffListProps> = ({ dayOffs }) => {
  const [, setPopupMessage] = useState<string | null>(null);
  const [dayOffList, setDayOffList] = useState<DayOffRequest[]>(dayOffs);
  const [selectedRows, setSelectedRows] = useState<SelectedRows>([]);
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
  }, [dayOffs]);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full bg-white border-collapse border">
          <thead>
            <tr className="bg-primary text-slate-200">
              <th className="border-x border-border px-4 py-2"></th>
              <th className="border-x border-border px-4 py-2">Id</th>
              <th className="border-x border-border px-4 py-2">Status</th>
              <th className="border-x border-border px-4 py-2">
                Pending Manager
              </th>
              <th className="border-x border-border px-4 py-2 ">Start Date</th>
              <th className="border-x border-border px-4 py-2">End Date</th>
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
        {
          dayOffList.length > 0 && (<div className="flex flex-row justify-end mx-8">
            <button
              onClick={cancelPendingRequests}
              className="bg-rejected hover:bg-hoverReject px-4 py-2 mt-2 text-3xl"
            >
              Cancel
            </button>
          </div>)
        }

      </div>
    </div>
  );
};

export default DayOffList;
