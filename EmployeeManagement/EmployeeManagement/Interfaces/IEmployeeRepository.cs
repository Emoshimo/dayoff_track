using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<ClientEmployee>> GetEmployees();
        Task<Employee> GetManagerAsync(int employeeId);
        Task<DayOffRequest> RequestDayOff(int employeeId, DateOnly startDate, DateOnly endDate);
        Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds);
        Task<ClientEmployee> GetEmployeeById(int id);
        Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId);
        Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId);

        /*
        Task<bool> DeleteEmployee(string id);
        Task<GeneralResponse> AssignManagerRole(string employeeId);
         */

    }
}
