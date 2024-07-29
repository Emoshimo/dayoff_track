using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffRequestRepository
    {
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId);
        Task<DayOffRequest> GetDayOffRequestById(int requestId);
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIds(IEnumerable<int> requestIds);
        Task<DayOffRequest> AddDayOffRequest(DayOffRequest dayOffRequest);
        Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId);
        IQueryable<DayOffRequest> GetPendingRequests(int managerId);
        Task SaveChangesAsync();
    }
}
