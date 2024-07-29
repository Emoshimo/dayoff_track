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
            return request;
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
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
