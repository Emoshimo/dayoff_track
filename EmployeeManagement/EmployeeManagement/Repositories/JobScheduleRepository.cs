using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class JobScheduleRepository : IJobScheduleRepository
    {
        private readonly AppDbContext _context;
        public JobScheduleRepository(AppDbContext context) 
        { 
            _context = context;
        }
        public async Task AddJobScheduleAsync(JobSchedule jobSchedule)
        {
            var newJobSchedule = new JobSchedule{
                JobKey = jobSchedule.JobKey,
                CronExpression = jobSchedule.CronExpression,
                IsActive = true
            };
            _context.JobSchedules.Add(newJobSchedule);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteJobSchedule(int Id)
        {
            var target = await _context.JobSchedules.FindAsync(Id);
            if (target == null)
            {
                throw new InvalidDataException("Job Schedule Not Found");
            }
            target.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task<JobSchedule> GetJobScheduleByIdAsync(int Id)
        {
            var target = await _context.JobSchedules.FindAsync(Id);
            if (target == null)
            {
                throw new InvalidDataException("Job Schedule Not Found");
            }
            return target;
        }

        public async Task<IEnumerable<JobSchedule>> GetJobSchedulesAsync()
        {
            return await _context.JobSchedules
                .Where(js => js.IsActive)
                .ToListAsync();
        }

        public async Task<JobSchedule> UpdateJobSchedule(JobSchedule jobSchedule)
        {
            int jobScheduleId = jobSchedule.Id;
            var target = await _context.JobSchedules.FindAsync(jobScheduleId);
            if ( target == null )
            {
                throw new InvalidDataException("Job Schedule Not Found.");
            }
            target.JobKey = target.JobKey;
            target.CronExpression = jobSchedule.CronExpression;
            target.IsActive = jobSchedule.IsActive;
            await _context.SaveChangesAsync();
            return target;
        }
    }
}
