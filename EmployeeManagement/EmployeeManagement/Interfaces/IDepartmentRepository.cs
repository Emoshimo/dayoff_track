using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using Microsoft.EntityFrameworkCore;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<Department> GetById(int id);
        Task<IEnumerable<DepartmentDTO>> GetAll();
        Task<Department> Create(DepartmentDTO department);
        Task<Department> AddEmployee(int DepartmentId, int EmployeeId);
        Task<bool> DeleteDepartment(int id);
        Task<DepartmentDTO> EditDepartment(DepartmentDTO department);

    }
}
