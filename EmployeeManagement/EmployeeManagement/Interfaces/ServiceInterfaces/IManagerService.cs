using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IManagerService
    {
        Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId);
        Task<int> EvaluateDayOff(int dayOffRequestId, int rdo, bool approved);
    }
}
