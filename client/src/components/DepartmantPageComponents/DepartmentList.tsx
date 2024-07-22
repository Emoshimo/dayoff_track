import React, { useEffect, useState } from "react";
import { editDepartment, fetchDepartments } from "../../api";
import { IDepartment } from "../../interfaces/interfaces";

const DepartmentList = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any>([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number>();
  const [editedDepartment, setEditedDepartment] = useState<IDepartment>();
  const token = localStorage.getItem("token");

  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const getDepartments = async () => {
    try {
      const response = await fetchDepartments(token!, showError);
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {}
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setEditedDepartment({ ...editedDepartment, [field]: e.target.value });
  };

  const handleEditClick = (employee: any) => {
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
      if (response.success) {
        const index = departments.findIndex(
          (emp: any) => emp.id === editingDepartmentId
        );
        if (index !== -1) {
          // Create a new array with the updated employee
          const updatedEmployees = [...departments];
          updatedEmployees[index] = { ...editedDepartment };

          // Update the state
          setDepartments(updatedEmployees);
        }
      }
      console.log(response);
    } catch (error) {}
    setEditingDepartmentId(0);
    setEditedDepartment({});
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
              <th className="border-x border-border px-4 py-2">Id</th>
              <th className="border-x border-border px-4 py-2">Name</th>
              <th className="border-x border-border px-4 py-2">ManagerId</th>
              <th className="border-x border-border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments &&
              departments?.map((department: IDepartment, index: number) => (
                <tr
                  key={department.id}
                  className={`text-center ${
                    index % 2 === 0 ? "" : "bg-gray-100"
                  }`}
                >
                  <td className="border px-4 py-2">{department.id}</td>
                  <td className="border px-4 py-2">
                    {editingDepartmentId === department.id ? (
                      <input
                        type="text"
                        value={editedDepartment?.name}
                        onChange={(e) => handleChange(e, "name")}
                        className="border p-1 text-center"
                      />
                    ) : (
                      department.name
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editingDepartmentId === department.id ? (
                      <input
                        type="number"
                        value={editedDepartment?.managerId}
                        onChange={(e) => handleChange(e, "surname")}
                        className="border p-1 text-center"
                      />
                    ) : (
                      department.managerId
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    {editingDepartmentId === department.id ? (
                      <button
                        onClick={handleSaveClick}
                        className="bg-green-500 text-white w-16 px-4 py-2 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClick(department)}
                        className="bg-primary text-white w-16 px-4 py-2 rounded hover:bg-hover"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentList;
