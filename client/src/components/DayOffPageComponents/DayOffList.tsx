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
              <th className="border-x border-border px-4 py-2">Type</th>
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
                      className="form-checkbox w-4 h-4 accent-primary cursor-pointer"
                      onChange={() => toggleRowSelection(item.id)}
                      checked={selectedRows.includes(item.id)}
                    />
                  </td>
                ) : (
                  <td className="border"></td>
                )}

                <td className="border px-4 py-2">{item.id}</td>
                <td
                  className={`text-slate-50 border px-4 py-2 ${getTitleBackgroundColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </td>
                <td
                  className={`border px-4 py-2`}
                >
                  {item.dayOffTypeId === 1 ? "Unpaid" : "Paid"}
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
          selectedRows.length > 0 && (
            <div className="fixed bottom-8 left-1/2">
              <div className="bg-primary p-2 rounded-lg shadow-lg flex flex-row items-center gap-4">
                <p className="text-slate-200" >{selectedRows.length} Selected</p>
                <button
                  onClick={cancelPendingRequests}
                  className="bg-rejected hover:bg-hoverReject rounded-md p-2 text-lg text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default DayOffList;
