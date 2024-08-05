import React, { useEffect, useState, useCallback, useRef } from "react";
import { fetchRemainingDayOffs } from "../../apicalls/employeeApi";
import { fetchPossibleManagers } from "../../apicalls/employeeApi";
import { fetchEmployees } from "../../apicalls/employeeApi";
import { editEmployee } from "../../apicalls/departmentApi";
import PopUp from "../PopUp";
import { ClientEmployee } from "../../interfaces/interfaces";
import DynamicTableHeader from "./DynamicTableHeader";
import DynamicSearchInput from "./DynamicSearchInput";
import { searchEmployees } from "../../apicalls/api";


const EmployeeList = () => {
  const columnNames = ['Id', 'Name', 'Surname', 'RemainingDayOffs', 'ManagerId', 'StartDate', 'Actions'];
  const searchFields = ['Id', 'Name', 'Surname', 'RemainingDayOffs', 'ManagerId', 'StartDate']
  const [searchTerms, setSearchTerms] = useState<ClientEmployee>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<any>();
  const [possibleManagers, setPossibleManagers] = useState<
    Record<number, any[]>
  >({});
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
    if (column === "ManagerId") {
      setSearchTerms(prevTerms => ({
        ...prevTerms,
        ["managerId"]: Number(value)
      }));
      return;
    }
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [column.toLowerCase()]: value,
    }));
  }, []);

  const handleSearchTermChange = async () => {
    const { employees, totalPageNumber } = await searchEmployees(pageNumber, pageSize, searchTerms?.name || null, searchTerms?.surname || null, searchTerms?.id || null, searchTerms?.managerId || null, 11, searchTerms?.startdate || null, showError);

    if (employees) {
      const updatedEmployeesPromises = employees!.map(async (employee: ClientEmployee) => {
        const remainingDayOffs = await fetchRemainingDayOffs(employee.id!);
        const managers = await fetchPossibleManagers(employee.id!);
        return {
          ...employee,
          remainingDayOffs,
          managers
        }
      })
      const updatedEmployees = await Promise.all(updatedEmployeesPromises);

      const possibleManagersMap: Record<number, any[]> = {};
      updatedEmployees.forEach(emp => {
        possibleManagersMap[emp.id!] = emp.managers;
      });
      setEmployees(updatedEmployees);
      setPossibleManagers(possibleManagersMap);
      setTotalPages(totalPageNumber);
    }
  }

  const fetchMoreEmployee = async () => {
    try {
      const { employees, totalPageNumber } = await fetchEmployees(pageNumber, pageSize, token!, showError);

      if (employees) {
        // Fetch remaining day offs and possible managers for each employee
        setTotalPages(totalPageNumber);
        const updatedEmployeesPromises = employees.map(async (employee: ClientEmployee) => {
          const remainingDayOffs = await fetchRemainingDayOffs(employee.id!);
          const managers = await fetchPossibleManagers(employee.id!);
          return {
            ...employee,
            remainingDayOffs, // Attach remaining day offs here
            managers
          };
        });
        const updatedEmployees = await Promise.all(updatedEmployeesPromises);

        // Create a map for possible managers
        const possibleManagersMap: Record<number, any[]> = {};
        updatedEmployees.forEach(emp => {
          possibleManagersMap[emp.id] = emp.managers;
        });

        // Update state with employees and possible managers
        setEmployees(updatedEmployees);
        setPossibleManagers(possibleManagersMap);
      } else {
        console.error("Fetch employees returned non-iterable data:", employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      showError("Failed to fetch more employees.");
    }
  };

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
    fetchMoreEmployee();
  }, [pageNumber, pageSize]);

  useEffect(() => {
    handleSearchTermChange()
  }, [searchTerms, pageNumber, pageSize])

  return (
    <div>
      <div className="overflow-x-auto">
        <div>
          <label htmlFor="pageSize">Page Size: </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border p-1 ml-2"
          >
            <option value={10}>10</option>
            <option value={20}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex flex-row items-start justify-between">
          {
            searchFields.map(field => (
              <DynamicSearchInput
                key={field}
                id={field.toLowerCase()}
                name={field}
                placeHolder={`${field}`}
                onChange={searchChange}
              />
            ))
          }
        </div>
        <table className="table-auto min-w-full bg-white border-collapse border">
          <DynamicTableHeader fields={columnNames} />

          <tbody>
            {employees &&
              employees.map((item: any, index: number) => (
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
                  <td className="border border-gray-300 px-4 py-2 w-32">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="number"
                        value={editedEmployee?.remainingDayOffs || ""}
                        onChange={(e) => handleChange(e, "remainingDayOffs")}
                        className="border p-1 text-center w-full"
                        style={{ MozAppearance: "textfield", WebkitAppearance: "none" }}
                      />
                    ) : (
                      item.remainingDayOffs || 0
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
                        {possibleManagers[item.id!]?.map((manager) => (
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
                  <td className="border border-gray-300 py-2 w-32">
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