using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IManagerRepository
    {
        Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId);
        Task<DayOffRequest> EvaluateDayOff(int dayOffRequestId, bool approved);
    }
}
