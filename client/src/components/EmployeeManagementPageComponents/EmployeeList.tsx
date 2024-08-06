import React, { useEffect, useState, useCallback, useRef } from "react";
import { editEmployee } from "../../apicalls/departmentApi";
import PopUp from "../PopUp";
import { ClientEmployee } from "../../interfaces/interfaces";
import DynamicTableHeader from "./DynamicTableHeader";
import DynamicSearchInput from "./DynamicSearchInput";
import { searchEmployees } from "../../apicalls/api";
import { fetchEmployees } from "../../apicalls/employeeApi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";


const EmployeeList = () => {
  const columnNames = ['Id', 'Name', 'Surname', 'ManagerId', 'StartDate', 'RemainingDayOffs', 'Actions'];
  const [sortKey, setSortKey] = useState('Id');
  const [sortOrder, setSortOrder] = useState('asc');
  const searchFields = ['Id', 'Name', 'Surname', 'ManagerId', 'StartDate']
  const [searchTerms, setSearchTerms] = useState<ClientEmployee>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<any>();
  const [possibleManagers, setPossibleManagers] = useState<ClientEmployee[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dropdownBatchNumber, setDropdownBatchNumber] = useState<number>(1);
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
    const { employees, totalPageNumber } = await searchEmployees(pageNumber, pageSize, searchTerms?.name || null, searchTerms?.surname || null, searchTerms?.id || null, searchTerms?.managerId || null, 11, searchTerms?.startDate || null, showError);

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
    fetchEmployeesForManagersDropdown();
    setEditingEmployeeId(employee.id);
    setEditedEmployee(employee);
  };


  useEffect(() => {
    handleSearchTermChange()
  }, [searchTerms, pageNumber, pageSize])


  // Dropdown pagination 
  const [hasMoreManagers, setHasMoreManagers] = useState<boolean>(true);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    fetchEmployeesForManagersDropdown();
  }, []);

  useEffect(() => {
    if (dropdownContainerRef.current && sentinelRef.current && hasMoreManagers) {
      const observer = new IntersectionObserver(handleObserver, {
        root: dropdownContainerRef.current,
        rootMargin: '1px',
        threshold: 1.0
      });
      observer.observe(sentinelRef.current);
      return () => {
        observer.unobserve(sentinelRef.current!);
      };
    }
  }, [hasMoreManagers]);

  const fetchEmployeesForManagersDropdown = async () => {
    const { employees } = await fetchEmployees(dropdownBatchNumber, 30, token!, showError);
    setPossibleManagers(employees);
    if (employees.length < 30) {
      setHasMoreManagers(false);
    }
  };

  const handleObserver = async (entries: IntersectionObserverEntry[]) => {
    console.log("observer triggered")
    const entry = entries[0];
    if (entry.isIntersecting && hasMoreManagers) {
      setDropdownBatchNumber(prev => prev + 1);
      const { employees } = await fetchEmployees(dropdownBatchNumber + 1, 30, token!, showError);
      setPossibleManagers(prev => [...prev, ...employees]);
      if (employees.length < 30) {
        setHasMoreManagers(false);
      }
    }
  };
  const handleSort = (key: any) => {
    if (sortKey === key) {
      // If the same key is clicked, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new key and default to ascending order
      setSortKey(key);
      setSortOrder('asc');
    }
    console.log(sortKey, sortOrder)
  };
  const getIconColor = (key: any, order: any) => {
    return sortKey === key ? (sortOrder === order ? 'text-red-500' : 'text-gray-500') : 'text-gray-500';
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
        <div className="flex flex-row items-start">
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
          <thead>
            <tr className='bg-primary text-slate-200'>

              <th key={"Id"} className='border border-gray-300 px-4 py-2'>
                {`Id `}
                <button onClick={() => handleSort('Id')}>
                  <FaAngleUp className={getIconColor('Id', 'asc')} />
                </button>
                <button onClick={() => handleSort('Id')}>
                  <FaAngleDown />
                </button>

              </th>
              <th key={"Name"} className='border border-gray-300 px-4 py-2'>
                {`Name `}
                <button onClick={() => handleSort('Name')}>
                  <FaAngleUp />
                </button>
                <button onClick={() => handleSort('Name')}>
                  <FaAngleDown />
                </button>

              </th>
              <th key={"Surname"} className='border border-gray-300 px-4 py-2 '>
                {`Surname `}
                <button onClick={() => handleSort('Surname')}>
                  <FaAngleUp />
                </button>
                <button onClick={() => handleSort('Surname')}>
                  <FaAngleDown />
                </button>

              </th>
              <th key={"ManagerId"} className='border border-gray-300 px-4 py-2 '>
                {`ManagerId `}
                <button onClick={() => handleSort('ManagerId')}>
                  <FaAngleUp />
                </button>
                <button onClick={() => handleSort('ManagerId')}>
                  <FaAngleDown />
                </button>

              </th>
              <th key={"StartDate"} className='border border-gray-300 px-4 py-2 '>
                {`StartDate `}
                <button onClick={() => handleSort('StartDate')}>
                  <FaAngleUp />
                </button>
                <button onClick={() => handleSort('StartDate')}>
                  <FaAngleDown />
                </button>

              </th>
              <th key={"RemainingDayOff"} className='border border-gray-300 px-4 py-2 '>
                {`RemainingDayOff `}

              </th>
              <th key={"Actions"} className='border border-gray-300 px-4 py-2 '>
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
                      <div ref={dropdownContainerRef} className="relative">

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
                        <div ref={sentinelRef} style={{ height: 1 }}></div>
                      </div>
                    ) : (
                      item.managerId || "None"
                    )}
                    <div ref={sentinelRef} style={{ height: 1, width: '100%' }}></div>
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