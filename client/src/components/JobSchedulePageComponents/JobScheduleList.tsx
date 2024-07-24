import React, { useEffect, useState } from 'react'
import { fetchJobSchedules, updateJobSchedule } from '../../apicalls/jobScheduleApi';
import { JobSchedule } from '../../interfaces/interfaces';
import PopUp from '../PopUp';

const JobScheduleList = () => {
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [jobSchedules, setJobSchedules] = useState<JobSchedule[]>([]);
    const [editingJobScheduleId, setEditingJobScheduleId] = useState(0);
    const [editingJobSchedule, setEditingJobSchedule] = useState<JobSchedule | undefined>(undefined);
    const showError = (message: any) => {
      setPopupMessage(message);
    };
    const token = localStorage.getItem("token");
    const getJobs = async () => 
    {
      const response = await fetchJobSchedules(token!, showError);
      if (response.success && response.data) 
        {
            setJobSchedules(response.data);
        }
    }
    const handleClosePopup = () => {
      setPopupMessage(null);
    };
    const handleEditClick = (jobSchedule: any) => {
        setEditingJobScheduleId(jobSchedule.id);
        setEditingJobSchedule(jobSchedule)
    }
    const handleCancelClick = () => {
        setEditingJobScheduleId(0)
        setEditingJobSchedule(undefined)
    }
    const handleSaveClick = async () => {
        const response = await updateJobSchedule(token!, editingJobSchedule!, showError)
    }
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: string
      ) => {
        const value = field === "isActive" ? e.target.checked : e.target.value
        setEditingJobSchedule({ ...editingJobSchedule!, [field]: value });
    };
    useEffect(() => {
      getJobs()
      console.log(jobSchedules)
    }, [])
  return (
    <div>
        <div className='overflow-x-auto'>
            <table className="table-auto min-w-full bg-white border-collapse border">
            <thead>
            <tr className="bg-primary text-slate-200">
              <th className="border-x border-border px-4 py-2">Id</th>
              <th className="border-x border-border px-4 py-2">JobKey</th>
              <th className="border-x border-border px-4 py-2">Cron Expression</th>
              <th className="border-x border-border px-4 py-2">Is Active</th>
              <th className="border-x border-border px-4 py-2">Group</th>
              <th className="border-x border-border px-4 py-2">Actions</th>

            </tr>
          </thead>
          <tbody>
            {jobSchedules && 
            jobSchedules.map ((jobSchedule: JobSchedule, index: number) =>(
                <tr
                key={jobSchedule.id}
                className={`text-center ${
                  index % 2 === 0 ? "" : "bg-gray-100"
                }`
                }>
                    <td className="border px-4 py-2 w-24">{jobSchedule.id}</td>
                    <td className="border px-4 py-2 w-32">{jobSchedule.jobKey}</td>
                    <td className="border px-4 py-2 w-32">
                        {
                            editingJobScheduleId === jobSchedule.id ? (
                                <input
                                type="string"
                                value={editingJobSchedule?.cronExpression}
                                onChange={(e) => handleChange(e, "cronExpression")}
                                className="border p-1 text-center w-full"
                              />
                            ) : (
                                jobSchedule.cronExpression
                            )
                        }
                    </td>
                    <td className="border px-4 py-2 w-32">
                    {
                            editingJobScheduleId === jobSchedule.id ? (
                                <input
                                type="checkbox"
                                checked={editingJobSchedule?.isActive}
                                onChange={(e) => handleChange(e, "isActive")}
                                className="border w-full h-6 rounded accent-primary focus:ring-primary"
                              />
                            ) : (
                                jobSchedule.isActive ? "Active" : "Inactive"
                            )
                        }
                    </td>
                    <td className="border px-4 py-2 w-32">{jobSchedule.group}</td>
                    <td className="border border-gray-300 py-2 w-32">
                    <div className="w-full overflow-hidden">
                      {editingJobScheduleId === jobSchedule.id ? (
                        <div className="">
                          <button
                          onClick={handleSaveClick}
                            className="bg-approved text-white px-4 py-2 rounded hover:bg-hoverApprove"
                          >
                            Save
                          </button>
                          <button
                          onClick={handleCancelClick}
                            className="bg-rejected text-white px-4 py-2 rounded hover:bg-hoverReject"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                        onClick={() => handleEditClick(jobSchedule)}
                          className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
            ) )}
          </tbody>
            </table>
        </div>
        {popupMessage && (
        <PopUp message={popupMessage} onClose={handleClosePopup} />
      )}
    </div>
  )
}

export default JobScheduleList