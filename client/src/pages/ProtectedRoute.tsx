import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  let decodedToken: any = null;

  if (token) {
    decodedToken = jwtDecode(token);
  }
  let userRole =
    decodedToken?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  console.log(userRole);
  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
