using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffRequestRepository
    {
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId);
        Task<DayOffRequest> GetDayOffRequestById(int requestId);
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIds(IEnumerable<int> requestIds);
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIdAndDates(int employeeId, DateOnly startDate, DateOnly endDate);
        Task<DayOffRequest> AddDayOffRequest(DayOffRequest dayOffRequest);
        Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId);
        IQueryable<DayOffRequest> GetPendingRequests(int managerId);
        Task<IEnumerable<DayOffRequest>> GetPendingAndApprovedByDates(int managerId, DateOnly startDate, DateOnly endDate);
        Task SaveChangesAsync();
    }
}
