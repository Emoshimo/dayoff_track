using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class DayOffRequestRepository : IDayOffRequestRepository
    {
        private readonly AppDbContext _context;
        public DayOffRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DayOffRequest> AddDayOffRequest(DayOffRequest request)
        {
            _context.DayOffRequests.Add(request);
            await SaveChangesAsync();
            return request;
        }

        public async Task<DayOffRequest> GetDayOffRequestById(int requestId)
        {
            var target = await _context.DayOffRequests.FindAsync(requestId);
            return target;
        }

        public async Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId)
        {
            var targets = await _context.DayOffRequests
                .Where(d => d.EmployeeId == employeeId)
                .Where(d => d.Status == "Pending" || d.Status == "Approved")
                .ToListAsync();
            return targets;
        }


        public async Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIds(IEnumerable<int> requestIds)
        {
            var targetRequests = await _context.DayOffRequests
                .Where(rq => requestIds.Contains(rq.Id))
                .ToListAsync();
            return targetRequests;
        }

        public async Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var pendingDayOffs = await _context.DayOffRequests
                                .OrderBy(rq => rq.StartDate)
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Pending")
                                .ToListAsync();

            return pendingDayOffs;
        }
        public async Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var approvedDayOffs = await _context.DayOffRequests
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Approved")
                                .ToListAsync();

            return approvedDayOffs;
        }
        public async Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var rejectedDayOffs = await _context.DayOffRequests
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Rejected")
                                .ToListAsync();

            return rejectedDayOffs;
        }

        public IQueryable<DayOffRequest> GetPendingRequests(int managerId)
        {
            var pendingRequests = _context.DayOffRequests
                .Where(request => request.PendingManagerId == managerId && request.Status == "Pending");

            return pendingRequests;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DayOffRequest>> GetPendingAndApprovedByDates(DateOnly startDate, DateOnly endDate)
        {
            return await _context.DayOffRequests
            .Where(d => d.Status == "Approved" || d.Status == "Pending")
            .Where(d => d.StartDate >= startDate && d.EndDate <= endDate).ToListAsync();
        }

        public async Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIdAndDates(int employeeId, DateOnly startDate, DateOnly endDate)
        {
            var targets = await _context.DayOffRequests
                .Where(d => d.EmployeeId == employeeId)
                .Where(d => d.Status == "Pending" || d.Status == "Approved")
                .Where(d => d.StartDate <= endDate && d.EndDate >= startDate)
                .ToListAsync();
            return targets;
        }
    }
}
