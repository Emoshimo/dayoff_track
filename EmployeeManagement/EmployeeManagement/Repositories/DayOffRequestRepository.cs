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
        public async Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId)
        {
            var targets = await _context.DayOffRequests
                .Where(d => d.EmployeeId == employeeId)
                .Where(d => d.Status == "Pending" || d.Status == "Approved")
                .ToListAsync();
            return targets;
        }
    }
}
