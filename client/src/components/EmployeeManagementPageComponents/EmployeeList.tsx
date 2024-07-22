import React, { useEffect, useState } from "react";
import { editEmployee, fetchEmployees, fetchPossibleManagers } from "../../api";
import PopUp from "../PopUp";
import { ClientEmployee } from "../../interfaces/interfaces";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<ClientEmployee>();
  const [possibleManagers, setPossibleManagers] = useState<
    Record<number, any[]>
  >({});
  const token = localStorage.getItem("token");
  const showError = (message: string) => {
    setPopupMessage(message);
  };
  const handleClosePopup = () => {
    setPopupMessage(null);
  };
  const fetchMoreEmployee = async () => {
    try {
      const newEmployees = await fetchEmployees(token!, showError);

      if (newEmployees) {
        console.log(newEmployees);
        setEmployees(newEmployees);
        const possibleManagersPromises = newEmployees.map(
          async (employee: any) => {
            const managers = await fetchPossibleManagers(employee.id);
            return { employeeId: employee.id, managers };
          }
        );
        const possibleManagersArray = await Promise.all(
          possibleManagersPromises
        );
        const possibleManagersMap: Record<number, any[]> = {};
        possibleManagersArray.forEach((item) => {
          possibleManagersMap[item.employeeId] = item.managers;
        });
        setPossibleManagers(possibleManagersMap);
      } else {
        console.error(
          "Fetch employees returned non-iterable data:",
          newEmployees
        );
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      showError("Failed to fetch more employees.");
    }
  };

  const handleSaveClick = async () => {
    try {
      const response = await editEmployee(
        editingEmployeeId!,
        editedEmployee!,
        token!,
        showError
      );
      if (response.success) {
        const index = employees.findIndex(
          (emp) => emp.id === editingEmployeeId
        );
        if (index !== -1) {
          // Create a new array with the updated employee
          const updatedEmployees = [...employees];
          updatedEmployees[index] = { ...editedEmployee };

          // Update the state
          setEmployees(updatedEmployees);
        }
      }
      console.log(response);
    } catch (error) {}
    setEditingEmployeeId(0);
    setEditedEmployee({});
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
  }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table-auto min-w-full bg-white border-collapse border">
          <thead>
            <tr className="bg-primary text-slate-200">
              <th className="border border-gray-300 px-4 py-2">Id</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Surname</th>
              <th className="border border-gray-300 px-4 py-2">
                Remaining Day Offs
              </th>
              <th className="border border-gray-300 px-4 py-2">Manager</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees &&
              employees.map((item: ClientEmployee, index: number) => (
                <tr
                  key={item.id}
                  className={`text-center ${
                    index % 2 === 0 ? "" : "bg-slate-100"
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {item.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.name || ""}
                        onChange={(e) => handleChange(e, "name")}
                        className="border p-1 text-center w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="text"
                        value={editedEmployee?.surname || ""}
                        onChange={(e) => handleChange(e, "surname")}
                        className="border p-1 text-center w-full"
                      />
                    ) : (
                      item.surname
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {editingEmployeeId === item.id ? (
                      <input
                        type="number"
                        value={editedEmployee?.remainingDayOffs || ""}
                        onChange={(e) => handleChange(e, "remainingDayOffs")}
                        className="border p-1 text-center w-full"
                      />
                    ) : (
                      item.remainingDayOffs
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
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
                  <td className="border border-gray-300 px-4 py-2">
                    {editingEmployeeId === item.id ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={handleSaveClick}
                          className="bg-green-500 text-white w-16 px-4 py-2 rounded hover:bg-green-600"
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
                        className="bg-primary text-white w-16 px-4 py-2 rounded hover:bg-gray-600"
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
      {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default EmployeeList;
