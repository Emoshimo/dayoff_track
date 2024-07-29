using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffRequestRepository
    {
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByIds(IEnumerable<int> requestIds);
        Task<DayOffRequest> AddDayOffRequest(DayOffRequest dayOffRequest);
        Task SaveChangesAsync();
    }
}
