import React, { useEffect, useState, useCallback } from "react";
import { editEmployee, fetchDepartments } from "../../apicalls/departmentApi";
import PopUp from "../PopUp";
import { ClientEmployee, IDepartment } from "../../interfaces/interfaces";
import DynamicSearchInput from "./DynamicSearchInput";
import { searchEmployees } from "../../apicalls/api";
import UpArrowButton from "./UpArrowButton";
import DownArrowButton from "./DownArrowButton";
import { deleteEmployee, fetchEmployees } from "../../apicalls/employeeApi";
import DeletePopUp from "../DeletePopUp";
import SaveButton from "../buttons/SaveButton";
import CancelButton from "../buttons/CancelButton";
import EditButton from "../buttons/EditButton";
import DeleteButton from "../buttons/DeleteButton";
import PageSizeSelector from "../PageSizeSelector";
import Pagination from "../Pagination";


const EmployeeList = () => {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState<ClientEmployee>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<ClientEmployee>();
  const [possibleManagers, setPossibleManagers] = useState<ClientEmployee[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [managerPageNumber, setManagerPageNumber] = useState<number>(1);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const getDepartments = async () => {
    const response = await fetchDepartments(token!, showError);
    if (response.success && response.data) {
      setDepartments(response.data)
    }
  }

  const searchChange = useCallback(async (value: string, column: string) => {
    if (column === "Department") {
      column = "departmentName"
    }
    setSearchTerms(prevTerms => ({
      ...prevTerms,
      [column[0].toLowerCase() + column.slice(1)]: value,
    }));


  }, []);

  const handleSearchTermChange = async () => {
    const { employees, totalPageNumber } = await searchEmployees(pageNumber, pageSize, searchTerms?.name ||
      null, searchTerms?.surname || null, searchTerms?.id || null, searchTerms?.supervisorId ||
    null, searchTerms?.startDate || null, searchTerms?.departmentName || null, sortKey, sortOrder, showError);
    console.log(employees)
    if (searchTerms?.name || searchTerms?.surname || searchTerms?.id || searchTerms?.supervisorId || searchTerms?.startDate, searchTerms?.departmentName) {
      setPageNumber(1)
    }
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
          emp.id === editingEmployeeId ? { ...editedEmployee!, remainingDayOffs: emp.remainingDayOffs, departmentName: response.data?.departmentName } : emp
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

  const handleDeleteClick = (employee: ClientEmployee) => {
    setEditingEmployeeId(employee.id);
    setIsPopupVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsPopupVisible(false);
    await deleteEmployee(token!, editingEmployeeId!);
    setEditingEmployeeId(0);
  };

  const handleCloseDeletePopup = () => {
    setIsPopupVisible(false);
    setEditedEmployee({});
    setEditingEmployeeId(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    let value: any = e.target.value;
    if (field === "supervisorId" && value === "null") {
      value = null;
    }
    setEditedEmployee({ ...editedEmployee, [field]: value });
  };

  const handleEditClick = async (employee: ClientEmployee) => {
    setEditingEmployeeId(employee.id);
    setEditedEmployee(employee);
    getDepartments();
  };


  const fetchManagers = async () => {
    const response = await fetchEmployees(managerPageNumber, 30, token!, showError);
    if (response?.data) {
      const newManagers = response.data.employees;
      setPossibleManagers(prevManagers => [...prevManagers, ...newManagers]);
    }
  };
  useEffect(() => {
    fetchManagers();
  }, [managerPageNumber]);

  useEffect(() => {
    handleSearchTermChange()
  }, [searchTerms, pageNumber, pageSize, sortKey, sortOrder])


  const handleSort = (key: any, order: string) => {
    if (sortKey === key) {
      // If the same key is clicked, toggle the sort order
      setSortOrder(null);
      setSortKey(null)
    }
    else if (key === "Department") {
      setSortOrder(order)
      setSortKey("departmentId")
    }
    else {
      // Set new key and default to ascending order
      setSortKey(key);
      setSortOrder(order);
    }
    console.log(sortKey, order)
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <PageSizeSelector pageSize={pageSize} onPageSizeChange={setPageSize} />
        <table className="table-auto min-w-full bg-white border-collapse border shadow-custom-black">
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

              <th key={"SupervisorId"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Supervisor `}
                <UpArrowButton currentKey='SupervisorId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='SupervisorId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="supervisorid"
                  key={"SupervisorId"}
                  name="SupervisorId"
                  placeHolder="SupervisorId"
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
              <th key={"Department"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                {`Department `}
                <UpArrowButton currentKey='DepartmentId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DownArrowButton currentKey='DepartmentId' handleSort={handleSort} sortKey={sortKey} sortOrder={sortOrder} />
                <DynamicSearchInput
                  id="department"
                  name="Department"
                  onChange={searchChange}
                  placeHolder="Department"
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
                  <td className="border border-gray-300 px-4 py-2 w-12">
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

                  <td className="border border-gray-300 py-2 w-12">
                    {editingEmployeeId === item.id ? (
                      <div>
                        <select
                          value={editedEmployee?.supervisorId || ""}
                          onChange={(e) => handleChange(e, "supervisorId")}
                          className="border p-1 text-center w-full"
                        >
                          <option value="">Select Manager</option>
                          {possibleManagers.map((manager: any) => (
                            <option value={manager.id}>
                              {manager.name} {manager.surname}
                            </option>
                          ))}

                        </select>

                      </div>

                    ) : (
                      item.supervisorId || "None"
                    )}

                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-24">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.startDate || ""}
                        onChange={(e) => handleChange(e, "startDate")}
                        className="border p-1 text-center w-full"
                      />
                    ) : (
                      item.startDate
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-24">
                    {editingEmployeeId === item.id ? (
                      <div>
                        <select
                          value={editedEmployee?.departmentId || ""}
                          onChange={(e) => handleChange(e, "departmentId")}
                          className="border p-1 text-center w-full"
                        >
                          <option value="">Select Department</option>
                          {
                            departments.map((department: IDepartment) => (
                              <option value={department.id}>
                                {department.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>

                    ) : (
                      item.departmentName || "None"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 w-12">

                    {item.calculatedRemainingDayOff || 0
                    }
                  </td>

                  <td className="border border-gray-300 py-2 w-48">
                    <div className="w-full overflow-hidden">
                      {editingEmployeeId === item.id ? (
                        <div className="flex justify-center gap-2">
                          <SaveButton a={handleSaveClick} />
                          <CancelButton a={handleCancelClick} />
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <EditButton a={handleEditClick} item={item} />

                          <div>
                            <DeleteButton a={handleDeleteClick} item={item} />
                            {isPopupVisible && (
                              <DeletePopUp
                                message="Are you sure you want to delete this employee?"
                                onClose={handleCloseDeletePopup}
                                onConfirm={handleConfirmDelete}
                              />
                            )}
                          </div>
                        </div>

                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>

        <Pagination pageNumber={pageNumber} totalPages={totalPages} setPageNumber={setPageNumber} />
      </div>
      {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};
export default EmployeeList;