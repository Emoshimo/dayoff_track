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
        public async Task<DepartmentDTO> EditDepartment(DepartmentDTO department)
        {
            var target = await _context.Departments.FindAsync(department.Id);
            if (target == null)
            {
                throw new InvalidOperationException("Target Department Not Found in Database");
            }
            var manager = await _context.Employees
                .Include(e => e.EmployeeRoles)
                .SingleOrDefaultAsync(e => e.Id == department.ManagerId);
            if (manager == null)
            {
                throw new InvalidOperationException("Manager not found in the database");
            }
            var managerRole = manager.EmployeeRoles
                .SingleOrDefault(er => er.RoleId == 3);
            if (managerRole != null)
            {
                managerRole.RoleId = 2;
            }
            target.Name = department.Name;
            target.ManagerId = department.ManagerId;
            await _context.SaveChangesAsync();
            var returnDepartment = new DepartmentDTO
            {
                Id = department.Id,
                ManagerId = department.ManagerId,
                Name = department.Name,
            };
            return returnDepartment;
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
        
    }
    
}
