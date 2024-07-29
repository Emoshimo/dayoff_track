import React, { useEffect, useState } from "react";
import { fetchEmployees, fetchPossibleManagers, fetchRemainingDayOffs } from "../../apicalls/api";
import { editEmployee } from "../../apicalls/departmentApi";
import PopUp from "../PopUp";
import { ClientEmployee } from "../../interfaces/interfaces";


const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number>();
  const [editedEmployee, setEditedEmployee] = useState<any>();
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
        // Fetch remaining day offs and possible managers for each employee
        const updatedEmployeesPromises = newEmployees.map(async (employee: ClientEmployee) => {
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
        console.error("Fetch employees returned non-iterable data:", newEmployees);
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
              employees.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className={`text-center ${
                    index % 2 === 0 ? "" : "bg-slate-100"
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
      </div>
      {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default EmployeeList;
