using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IManagerService
    {
        Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId);
        Task<DayOffRequest> EvaluateDayOff(int dayOffRequestId, bool approved);
    }
}
