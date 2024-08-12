using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IManagerRepository
    {
        Task<IEnumerable<Employee>> GetDepartmentEmployees(int managerId, int pageSize, int pageNumber);
    }
}
