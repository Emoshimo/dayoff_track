import React from 'react'
import JobScheduleList from '../components/JobSchedulePageComponents/JobScheduleList';

const JobSchedulePage = () => {
  return (
    <div>
      <header className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-primary text-2xl font-semibold">
        Job Schedules Table
        </h3>
        <button
          className="text-primary flex items-center justify-center w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
        </button>
      </header>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col justify-around">
          <JobScheduleList />
        </div>
      </div>
    </div>
  )
}

export default JobSchedulePage