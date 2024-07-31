using EmployeeManagement.Data;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IEmployeeService
    {
        Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate);
        Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds);
        Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId);
        Task<IEnumerable<EmployeeDayOffsDTO>> GetTopEmployeesDayOffsAsync(string timePeriod, int topN);
        Task<int> CalculateRemainingDayOffs(int employeeId);
        bool IsAnniversary(DateOnly startDate);
        int GetWorkingDays(DateOnly startDate, DateOnly endDate);
        int AnniversaryDayOffAdditions(Employee employee);
    }
}
