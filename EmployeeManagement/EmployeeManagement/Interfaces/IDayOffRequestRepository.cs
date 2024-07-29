using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffRequestRepository
    {
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId);
        Task<DayOffRequest> GetDayOffRequestById(int requestId);
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIds(IEnumerable<int> requestIds);
        Task<DayOffRequest> AddDayOffRequest(DayOffRequest dayOffRequest);
        IQueryable<DayOffRequest> GetPendingRequests(int managerId);
        Task SaveChangesAsync();
    }
}
