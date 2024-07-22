using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _context;

        public ManagerRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId)
        {
            var manager = await _context.Employees.FindAsync(managerId);
            if (manager == null)
            {
                return null;
            }
            var requests = await (from request in _context.DayOffRequests
                                  join employee in _context.Employees
                                  on request.EmployeeId equals employee.Id
                                  where request.PendingManagerId == managerId && request.Status == "Pending"
                                  select new DayOffRequestForManager
                                  {
                                      Id = request.Id,
                                      EmployeeName = employee.Name,
                                      EmployeeSurname = employee.Surname,
                                      StartDate = request.StartDate,
                                      EndDate = request.EndDate
                                  }).ToListAsync();
            return requests;
        }
        public async Task<DayOffRequest> EvaluateDayOff(int dayOffRequestId, bool approved)
        {
            var dayOffRequest = await _context.DayOffRequests.FindAsync(dayOffRequestId);
            if (dayOffRequest == null)
            {
                return null;
            }
            if (dayOffRequest.Status != "Pending")
            {
                throw new InvalidOperationException($"Day off request with ID {dayOffRequestId} cannot be evaluated as it is not pending.");
            }
            var evaluatingManager = await _context.Employees.FindAsync(dayOffRequest.PendingManagerId);
            if (evaluatingManager?.ManagerId != null)
            {
                dayOffRequest.PendingManagerId = evaluatingManager.ManagerId;
            }
            else
            {
                // If the evaluating manager has no manager, approve or reject the request
                if (approved == true)
                {
                    dayOffRequest.Status = "Approved";
                }
                else
                {
                    dayOffRequest.Status = "Rejected";
                }
            }
            await _context.SaveChangesAsync();
            return dayOffRequest;

        }
    }
}
