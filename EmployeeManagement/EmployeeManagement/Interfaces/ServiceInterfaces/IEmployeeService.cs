using EmployeeManagement.Data;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IEmployeeService
    {
        Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate);
        Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds);
        Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId);
        Task<int> CalculateRemainingDayOffs(int employeeId);
        bool IsAnniversary(DateOnly startDate);
        int GetWorkingDays(DateOnly startDate, DateOnly endDate);
        int AnniversaryDayOffAdditions(Employee employee);
        Task<int> CacheRemainingDayOff(int id);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffsCache(int id);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffsCache(int id);
    }
}
