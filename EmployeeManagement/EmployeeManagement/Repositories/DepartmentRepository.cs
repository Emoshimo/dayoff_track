using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _context;
        public DepartmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Department> AddEmployee(int departmentId, int employeeId)
        {

            var department = await _context.Departments.FindAsync(departmentId);
            if (department == null)
            {
                throw new InvalidOperationException("Department not found.");
            }

            //var existingAssociation = department.EmployeeDepartments.FirstOrDefault(ed => ed.EmployeeId == employeeId);
           
  
            //department.EmployeeDepartments.Add(employeeDepartment);
            await _context.SaveChangesAsync();
            return department;
        }

        public async Task<Department> Create(DepartmentDTO departmentDTO)
        {

                Department department = new Department
                {
                    Name = departmentDTO.Name,
                    ManagerId = departmentDTO.ManagerId,
                };
                _context.Departments.Add(department);
                await _context.SaveChangesAsync();
                return department;
        }

        public async Task<IEnumerable<DepartmentDTO>> GetAll()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentDTO
                {
                    Id = d.Id,
                    Name = d.Name,
                    ManagerId = d.ManagerId
                })
                .ToListAsync();

            return departments;
        }

        public async Task<Department> GetById(int id)
        {
            var targetDepartment = await _context.Departments.FindAsync(id);
            return targetDepartment;
        }

        public async Task<bool> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return false;
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<GeneralResponse> SetManagerForDepartment(int departmentId, int managerId)
        {
            var department = await _context.Departments.FindAsync(departmentId);
            if (department == null)
            {
                return new GeneralResponse(false, "Department not found.");
            }
            department.ManagerId = managerId;
            await _context.SaveChangesAsync();
            return new GeneralResponse(true, $"Manager assigned for {departmentId}.");
        }
        
        public async Task<IEnumerable<DepartmentDTO>> GetDepartmentsWithoutManager()
        {
            var response = await _context.Departments
                .Where(d => d.ManagerId == null)
                .ToListAsync();
            if (response == null)
            {
                return null;
            }
            var clientDepartments = response.Select(d => new DepartmentDTO
            {
               Id = d.Id,
               Name = d.Name,
               ManagerId = d.ManagerId,
            });
            return clientDepartments;
        }
    }
    
}
