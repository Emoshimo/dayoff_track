import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeePage from "./pages/EmployeePage";
import AdminPage from "./pages/AdminPage";
import DashboardLayout from "./components/DashboardLayout";
import DayOffPage from "./pages/DayOffPage";
import ManagerPage from "./pages/ManagerPage";
import RegisterEmployeePage from "./pages/EmployeeManagementPage";
import CreateDepartmentPage from "./pages/DepartmentPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route path="employee" element={<EmployeePage />}></Route>
            <Route path="dayoff" element={<DayOffPage />}></Route>
            <Route
              path="create-department"
              element={<CreateDepartmentPage />}
            ></Route>
            <Route
              path="register-employee"
              element={<RegisterEmployeePage />}
            ></Route>
            <Route path="admin/*" element={<AdminPage />}></Route>
            <Route path="manager" element={<ManagerPage />}></Route>
          </Route>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
