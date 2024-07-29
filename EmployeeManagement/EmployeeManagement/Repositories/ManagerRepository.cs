using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Services.EmployeeCacheService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _context;
        private readonly IEmployeeCache _employeeCache;

        public ManagerRepository(AppDbContext context, IEmployeeCache employeeCache)
        {
            _context = context;
            _employeeCache = employeeCache;
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
                    int RDOChange = GetWorkingDays(dayOffRequest.StartDate, dayOffRequest.EndDate);
                    _employeeCache.UpdateRemainingDayOff(dayOffRequest.EmployeeId, RDOChange);
                }
            }
            await _context.SaveChangesAsync();
            return dayOffRequest;

        }
        private int GetWorkingDays(DateOnly startDate, DateOnly endDate)
        {
            int workingDays = 0;

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                if (date.DayOfWeek != DayOfWeek.Saturday || date.DayOfWeek != DayOfWeek.Sunday)
                {
                    workingDays++;
                }
            }
            return workingDays;
        }
    }
}