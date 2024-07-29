using EmployeeManagement.Data;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<ClientEmployee>> GetEmployees();
        Task<Employee> GetManagerAsync(int employeeId);
        Task<IEnumerable<Employee>> GetManagers(); 
        Task<ClientEmployee> GetEmployeeById(int id);
        Task<Employee> GetEmployee(int id);
        Task UpdateEmployee(ClientEmployee employee);
        Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId);
        Task<List<Employee>> GetAllEmployeesExcept(int employeeId);
        Task<List<Employee>> GetDirectSubordinates(int managerId);
    }
}
