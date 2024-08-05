using EmployeeManagement.Data;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IEmployeeService
    {
        Task<int> RequestDayOff(int employeeId, int dayOffType, int rdo, DateOnly startDate, DateOnly endDate);
        Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds);
        Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId);
        Task<IEnumerable<EmployeeDayOffsDTO>> GetTopEmployeesDayOffsAsync(string timePeriod, int topN);
        Task<PaginationResponse> SearchEmployees(int pageNumber, int pageSize,
                string nameSearchTerm, string surnameSearchTerm, int? idSearchTerm,
                int? managerIdSearchTerm, int? remainingDayOffSearchTerm, string? startDateSearchTerm);
        Task<int> GetPageNumber(int pageSize);
        Task<int> CalculateRemainingDayOffs(int employeeId);
        bool IsAnniversary(DateOnly startDate);
        int GetWorkingDays(DateOnly startDate, DateOnly endDate);
        int AnniversaryDayOffAdditions(Employee employee);
    }
}
