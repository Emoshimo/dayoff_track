import React from "react";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="">
      <h1 className="absolute text-center text-2xl font-bold"></h1>

      <div className=" bg-gray-100 ">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
