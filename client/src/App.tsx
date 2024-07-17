import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeePage from "./pages/EmployeePage";
import AdminPage from "./pages/AdminPage";
import DashboardLayout from "./components/DashboardLayout";
import DayOffPage from "./pages/DayOffPage";
import ManagerPage from "./pages/ManagerPage";
import RegisterEmployee from "./components/AdminPageComponents/RegisterEmployee";
import AssignManager from "./components/AdminPageComponents/AssignManager";
import CreateDepartment from "./components/AdminPageComponents/CreateDepartment";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/dashboard/*" element={<DashboardLayout />}>
            <Route path="employee" element={<EmployeePage />}></Route>
            <Route path="dayoff" element={<DayOffPage />}></Route>
            <Route path="admin/*" element={<AdminPage />}>
              <Route
                path="register-employee"
                element={<RegisterEmployee />}
              ></Route>
              <Route path="assign-manager" element={<AssignManager />}></Route>
              <Route
                path="create-department"
                element={<CreateDepartment />}
              ></Route>
            </Route>
            <Route path="manager" element={<ManagerPage />}></Route>
          </Route>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
