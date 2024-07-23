using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IJobScheduleRepository
    {
        Task<IEnumerable<JobSchedule>> GetJobSchedulesAsync();
        Task<JobSchedule> GetJobScheduleByIdAsync(int Id);
        Task AddJobScheduleAsync(JobSchedule jobSchedule);
        Task<JobSchedule> UpdateJobSchedule (JobSchedule jobSchedule);
        Task DeleteJobSchedule(int Id);
    }
}
