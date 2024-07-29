using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<ClientEmployee>> GetEmployees();
        Task<Employee> GetManagerAsync(int employeeId);
        Task<IEnumerable<Employee>> GetManagers(); 
        Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate);
        Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds);
        Task<ClientEmployee> GetEmployeeById(int id);
        Task UpdateEmployee(ClientEmployee employee);
        Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId);
        Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId);
        Task<int> CalculateRemainingDayOffs(int employeeId);
        bool IsAnniversary(DateOnly startDate);

        /*
        Task<bool> DeleteEmployee(string id);
        Task<GeneralResponse> AssignManagerRole(string employeeId);
         */

    }
}
