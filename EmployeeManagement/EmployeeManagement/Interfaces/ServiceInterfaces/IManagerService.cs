using EmployeeManagement.Data;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IManagerService
    {
        Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId);
        Task<int> EvaluateDayOff(int dayOffRequestId, int rdo, bool approved);
        Task<IEnumerable<ClientEmployee>> GetDepartmentEmployees(int managerId, int pageSize, int pageNumber);
        Task<IEnumerable<ClientEmployee>> GetManagerEmployees();
    }
}
