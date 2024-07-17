import React from 'react'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
    <NavBar />
    <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
      <Outlet />
    </div>
  </div>
  )
}

export default DashboardLayout