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
        IQueryable<Employee> GetAll();
        Task UpdateEmployee(ClientEmployee employee);
        Task<List<Employee>> GetAllEmployeesExcept(int employeeId);
        Task<List<Employee>> GetDirectSubordinates(int managerId);
    }
}
