import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useEmployeeStore from "../stores/employeeStore";

const NavBar = () => {
  const { reset } = useEmployeeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  let decodedToken: any = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }
  let userRole =
    decodedToken?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  const handleLogout = () => {
    localStorage.clear();
    reset();
    navigate("/");
  };
  return (
    <div className="h-screen bg-primary white w-64 flex flex-col justify-between align-middle">
      <div>
        <div>
          <h2 className="text-2xl font-bold text-center mt-8 text-slate-200">
            Menu
          </h2>
        </div>
        <nav className="mt-8 text-slate-200">
          <NavLink
            to="/dashboard/employee"
            className={({ isActive }) =>
              `block px-4 py-2 text-lg rounded hover:bg-hover ${
                isActive ? "bg-second" : ""
              }`
            }
          >
            Employee
          </NavLink>
          <NavLink
            to="/dashboard/dayoff"
            className={({ isActive }) =>
              `block px-4 py-2 text-lg rounded hover:bg-hover ${
                isActive ? "bg-second" : ""
              }`
            }
          >
            DayOff Requests
          </NavLink>

          {userRole === "Admin" && (
            <>
              <NavLink
                to="/dashboard/admin"
                className={`block px-4 py-2 text-lg rounded hover:bg-hover ${
                  location.pathname.startsWith("/dashboard/admin")
                    ? "bg-second"
                    : ""
                }`}
              >
                Admin
              </NavLink>
              <ul className="m-2 mx-4">
                <li>
                  <NavLink
                    to="/dashboard/admin/create-department"
                    className={`block px-4 py-1 text-lg rounded hover:bg-hover ${
                      location.pathname === "/dashboard/admin/create-department"
                        ? "bg-second"
                        : ""
                    }`}
                  >
                    Create Department
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/register-employee"
                    className={`block px-4 py-2 text-lg rounded hover:bg-hover ${
                      location.pathname === "/dashboard/admin/register-employee"
                        ? "bg-second"
                        : ""
                    }`}
                  >
                    Register Employee
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/admin/assign-manager"
                    className={`block px-4 py-2 text-lg rounded hover:bg-hover ${
                      location.pathname === "/dashboard/admin/assign-manager"
                        ? "bg-second"
                        : ""
                    }`}
                  >
                    Assign Manager
                  </NavLink>
                </li>
              </ul>
            </>
          )}
          {userRole === "Manager" && (
            <NavLink
              to="/dashboard/manager"
              className={({ isActive }) =>
                `block px-4 py-2 text-lg rounded hover:bg-hover ${
                  isActive ? "bg-second" : ""
                }`
              }
            >
              Manager
            </NavLink>
          )}
        </nav>
      </div>

      <button
        className="bg-red-500 text-white text-lg py-2 px-4 rounded mb-4 mx-4 hover:bg-red-600 focus:outline-none"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
