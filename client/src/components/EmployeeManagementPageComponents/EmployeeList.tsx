import React, { useEffect, useState, useCallback, useRef } from "react";
import { editEmployee } from "../../apicalls/departmentApi";
import PopUp from "../PopUp";
import { ClientEmployee } from "../../interfaces/interfaces";
import DynamicTableHeader from "./DynamicTableHeader";
import DynamicSearchInput from "./DynamicSearchInput";
import { searchEmployees } from "../../apicalls/api";
import { fetchEmployees } from "../../apicalls/employeeApi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import UpArrowButton from "./UpArrowButton";
import DownArrowButton from "./DownArrowButton";


const EmployeeList = () => {
  const columnNames = ['Id', 'Name', 'Surname', 'ManagerId', 'StartDate', 'RemainingDayOffs', 'Actions'];
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<ClientEmployee>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<any>();
  const [possibleManagers, setPossibleManagers] = useState<ClientEmployee[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleClosePopup = () => {
    setPopupMessage(null);
  };


  const searchChange = useCallback(async (value: string, column: string) => {
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [column[0].toLowerCase() + column.slice(1)]: value,
    }));

  }, []);

  const handleSearchTermChange = async () => {
    const { employees, totalPageNumber } = await searchEmployees(pageNumber, pageSize, searchTerms?.name ||
      null, searchTerms?.surname || null, searchTerms?.id || null, searchTerms?.managerId ||
    null, 11, searchTerms?.startDate || null, sortKey, sortOrder, showError);

    if (employees) {
      setEmployees(employees);
      setTotalPages(totalPageNumber);
    }
  }

  const handleSaveClick = async () => {
    try {
      const response = await editEmployee(editingEmployeeId!, editedEmployee!, token!, showError);
      if (response.success) {
        // Update the employee in state with new data
        const updatedEmployees = employees.map(emp =>
          emp.id === editingEmployeeId ? { ...editedEmployee!, remainingDayOffs: emp.remainingDayOffs } : emp
        );

        // Update the state
        setEmployees(updatedEmployees);
      }
    } catch (error) {
      showError("Failed to save employee.");
    }
    setEditingEmployeeId(undefined);
    setEditedEmployee(undefined);
  };
  const handleCancelClick = () => {
    setEditedEmployee({});
    setEditingEmployeeId(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    let value: any = e.target.value;
    if (field === "managerId" && value === "null") {
      value = null;
    }
    setEditedEmployee({ ...editedEmployee, [field]: value });

  };

  const handleEditClick = async (employee: ClientEmployee) => {
    setEditingEmployeeId(employee.id);
    setEditedEmployee(employee);
  };


  useEffect(() => {
    handleSearchTermChange()
  }, [searchTerms, pageNumber, pageSize, sortKey, sortOrder])


  const handleSort = (key: any, order: string) => {
    if (sortKey === key) {
      // If the same key is clicked, toggle the sort order
      setSortOrder(null);
      setSortKey(null)
    } else {
      // Set new key and default to ascending order
      setSortKey(key);
      setSortOrder(order);
    }
    console.log(sortKey, order)
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <div>
          <label htmlFor="pageSize">Page Size: </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border p-1 ml-2 mb-2"
          >
            <option value={10}>10</option>
            <option value={20}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <table className="table-auto min-w-full bg-white border-collapse border">
          <thead>
            <tr>
              <th key={"Id"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Id `}
                <UpArrowButton currentKey='Id' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='Id' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="id"
                  key={"Id"}
                  name="Id"
                  placeHolder="Id"
                  onChange={searchChange}
                />
              </th>
              <th key={"Name"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Name `}
                <UpArrowButton currentKey='Name' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='Name' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="name"
                  key={"Name"}
                  name="Name"
                  placeHolder="Name"
                  onChange={searchChange}
                />
              </th>
              <th key={"Surname"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Surname `}
                <UpArrowButton currentKey='Surname' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='Surname' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="surname"
                  key={"Surname"}
                  name="Surname"
                  placeHolder="Surname"
                  onChange={searchChange}
                />
              </th>

              <th key={"ManagerId"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`ManagerId `}
                <UpArrowButton currentKey='ManagerId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='ManagerId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="managerid"
                  key={"ManagerId"}
                  name="ManagerId"
                  placeHolder="ManagerId"
                  onChange={searchChange}
                />

              </th>

              <th key={"StartDate"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`StartDate `}
                <UpArrowButton currentKey='StartDate' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='StartDate' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="startdate"
                  name="StartDate"
                  onChange={searchChange}
                />
              </th>

              <th key={"RemainingDayOff"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`RemainingDayOff `}
              </th>

              <th key={"Actions"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Actions `}
              </th>
            </tr>

          </thead>
          <tbody>
            {employees &&
              employees.map((item: ClientEmployee, index: number) => (
                <tr
                  key={item.id}
                  className={`text-center ${index % 2 === 0 ? "" : "bg-slate-100"
                    }`}
                >
                  <td className="border border-gray-300 px-4 py-2 w-24">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-32">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.name || ""}
                        onChange={(e) => handleChange(e, "name")}
                        className="border p-1 text-center w-full"
                        style={{ maxWidth: "100%" }}
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-32">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.surname || ""}
                        onChange={(e) => handleChange(e, "surname")}
                        className="border p-1 text-center w-full"
                        style={{ maxWidth: "100%" }}
                      />
                    ) : (
                      item.surname
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 w-24">
                    {editingEmployeeId === item.id ? (
                      <select
                        value={editedEmployee?.managerId || ""}
                        onChange={(e) => handleChange(e, "managerId")}
                        className="border p-1 text-center w-full"
                      >
                        <option value="">Select Manager</option>
                        {possibleManagers.map((manager: any) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.name} {manager.surname}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.managerId || "None"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-32">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.startDate || ""}
                        onChange={(e) => handleChange(e, "startDate")}
                        className="border p-1 text-center w-full"
                        style={{ maxWidth: "100%" }}
                      />
                    ) : (
                      item.startDate
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-32">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="number"
                        value={item.calculatedRemainingDayOff || ""}
                        onChange={(e) => handleChange(e, "remainingDayOffs")}
                        className="border p-1 text-center w-full"
                        style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                      />
                    ) : (
                      item.calculatedRemainingDayOff || 0
                    )}
                  </td>
                  <td className="border border-gray-300 py-2 w-48">
                    <div className="w-full overflow-hidden">
                      {editingEmployeeId === item.id ? (
                        <div className="">
                          <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item)}
                          className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>

        <div className="m-4 flex items-center justify-center">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className={`text-slate-200 px-3 py-1 rounded mr-2 ${pageNumber === 1 ? `bg-gray-400` : `bg-primary`}`}
          >
            Previous
          </button>
          <span>Page {pageNumber} of {totalPages}</span>
          <button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
            disabled={pageNumber === totalPages}
            className={`text-slate-200 px-3 py-1 rounded ml-2 ${pageNumber === totalPages ? `bg-gray-400` : `bg-primary`}`}
          >
            Next
          </button>
        </div>
      </div>
      {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};
export default EmployeeList;