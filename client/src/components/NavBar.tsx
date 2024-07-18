import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdAdminPanelSettings, MdLogout } from "react-icons/md";
import { FaCalendarDay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaCodePullRequest } from "react-icons/fa6";

import useEmployeeStore from "../stores/employeeStore";

const NavBar = () => {
  const { reset } = useEmployeeStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isExpanded, setIsExpanded] = useState(true);

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
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div
      className={`flex h-screen transition-all duration-1000 ${
        isExpanded ? "w-56" : "w-20"
      } bg-primary text-slate-200`}
    >
      <div className={`flex flex-col items-center justify-between flex-grow `}>
        <div>
          <div className="flex items-center justify-between p-4">
            {isExpanded && <h2 className="text-2xl font-bold">Menu</h2>}
            <button onClick={toggleSidebar} className="text-lg">
              {isExpanded ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </div>
          <nav className="mt-8">
            <NavLink
              to="/dashboard/employee"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                  isActive ? "bg-second" : ""
                }`
              }
            >
              <MdAdminPanelSettings style={{ width: "32px", height: "32px" }} />
              {isExpanded && "Employee"}
            </NavLink>
            <NavLink
              to="/dashboard/dayoff"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                  isActive ? "bg-second" : ""
                }`
              }
            >
              <FaCalendarDay style={{ width: "32px", height: "32px" }} />
              {isExpanded && "DayOff Requests"}
            </NavLink>

            {userRole === "Admin" && (
              <>
                <NavLink
                  to="/dashboard/admin"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                      isActive ? "bg-second" : ""
                    }`
                  }
                >
                  <MdAdminPanelSettings
                    style={{ width: "32px", height: "32px" }}
                  />
                  {isExpanded && "Admin"}
                </NavLink>{" "}
                <NavLink
                  to="/dashboard/create-department"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                      isActive ? "bg-second" : ""
                    }`
                  }
                >
                  <HiOfficeBuilding style={{ width: "32px", height: "32px" }} />
                  {isExpanded && "Create Department"}
                </NavLink>
                <NavLink
                  to="/dashboard/register-employee"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                      isActive ? "bg-second" : ""
                    }`
                  }
                >
                  <MdAdminPanelSettings
                    style={{ width: "32px", height: "32px" }}
                  />
                  {isExpanded && "Register Employee"}
                </NavLink>
              </>
            )}

            {userRole === "Manager" && (
              <NavLink
                to="/dashboard/manager"
                className={({ isActive }) =>
                  `flex flex-row items-center px-4 py-2 text-lg rounded hover:bg-hover ${
                    isActive ? "bg-second" : ""
                  }`
                }
              >
                <FaCodePullRequest style={{ width: "32px", height: "32px" }} />{" "}
                {isExpanded && "Manager"}
              </NavLink>
            )}
          </nav>
        </div>

        <button
          className="flex flex-row items-center bg-rejected text-white text-lg font-bold py-2 px-4 rounded mb-4 hover:bg-red-600 focus:outline-none"
          onClick={handleLogout}
        >
          <MdLogout style={{ width: "32px", height: "32px" }} />
          {isExpanded && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
