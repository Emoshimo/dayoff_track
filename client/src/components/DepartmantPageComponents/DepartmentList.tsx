import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../apicalls/departmentApi";
import { editDepartment } from "../../apicalls/departmentApi";
import { ClientEmployee, IDepartment } from "../../interfaces/interfaces";
import { fetchEmployees } from "../../apicalls/employeeApi";
import PopUp from "../PopUp";

const DepartmentList = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any>([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number>();
  const [editedDepartment, setEditedDepartment] = useState<IDepartment>();
  const [possibleManagers, setPossibleManagers] = useState<ClientEmployee[]>([]);

  const token = localStorage.getItem("token");

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const getDepartments = async () => {
    try {
      const response = await fetchDepartments(token!, showError);
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error) { }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    setEditedDepartment({ ...editedDepartment, [field]: e.target.value });
  };

  const handleEditClick = (employee: any) => {
    fetchManagers();
    setEditingDepartmentId(employee.id);
    setEditedDepartment(employee);
  };

  const handleSaveClick = async () => {
    try {
      const response = await editDepartment(
        editingDepartmentId!,
        editedDepartment!,
        token!,
        showError
      );
      if (response.success && response.data) {
        const index = departments.findIndex(
          (emp: any) => emp.id === editingDepartmentId
        );
        if (index !== -1) {
          const updatedDepartments = [...departments];
          const updatedDepartment = {
            ...editedDepartment,
            managerName: response.data.managerName, // Set the updated managerName
            managerSurname: response.data.managerSurname, // Set the updated managerSurname
          };
          updatedDepartments[index] = { ...updatedDepartment };

          setDepartments(updatedDepartments);
        }
      }
      console.log(response);
    } catch (error) { }
    setEditingDepartmentId(0);
    setEditedDepartment({});
  };
  const handleCancelClick = () => {
    setEditedDepartment({});
    setEditingDepartmentId(0);
  };
  const fetchManagers = async () => {
    const response = await fetchEmployees(1, 30, token!, showError);
    if (response?.data) {
      const newManagers = response.data.employees;
      setPossibleManagers(prevManagers => [...prevManagers, ...newManagers]);
    }
  };
  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full bg-white border-collapse border">
          <thead>
            <tr className="bg-primary text-slate-200">
              <th className="border-x border-border px-4 py-2">Name</th>
              <th className="border-x border-border px-4 py-2">Manager</th>
              <th className="border-x border-border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments &&
              departments?.map((department: IDepartment, index: number) => (
                <tr
                  key={department.id}
                  className={`text-center ${index % 2 === 0 ? "" : "bg-gray-100"
                    }`}
                >

                  <td className="border px-4 py-2 w-32">
                    {editingDepartmentId === department.id ? (
                      <input
                        type="text"
                        value={editedDepartment?.name}
                        onChange={(e) => handleChange(e, "name")}
                        className="border p-1 text-center w-full"
                      />
                    ) : (
                      department.name
                    )}
                  </td>
                  <td className="border px-4 py-2 w-32">
                    {editingDepartmentId === department.id ? (
                      <div>
                        <select
                          value={editedDepartment?.managerId || ''}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(e, 'managerId')}
                          className="border text-center p-1 w-full"
                        >
                          <option value="">Select Manager</option>
                          {possibleManagers.map((manager: ClientEmployee) => (
                            <option value={manager.id}>
                              {manager.name} {manager.surname}
                            </option>
                          ))
                          }
                        </select>
                      </div>

                    ) : (
                      `${department.managerName} ${department.managerSurname}`
                    )}
                  </td>

                  <td className="border border-gray-300 py-2 w-32">
                    <div className="w-full overflow-hidden">
                      {editingDepartmentId === department.id ? (
                        <div className="">
                          <button
                            onClick={handleSaveClick}
                            className="bg-approved text-white px-4 py-2 rounded hover:bg-hoverApprove"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="bg-rejected text-white px-4 py-2 rounded hover:bg-hoverReject"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(department)}
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
        {popupMessage && (
          <PopUp message={popupMessage} onClose={handleClosePopup} />
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
