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
            var target = await _context.Departments
                .Include(d => d.Manager)
                .ThenInclude(m => m.EmployeeRole) // Since EmployeeRole is now a single entity, this works directly
                .SingleOrDefaultAsync(d => d.Id == department.Id);

            if (target == null)
            {
                throw new InvalidOperationException("Target Department Not Found in Database");
            }

            // Check if the new manager is already managing another department
            var existingDepartment = await _context.Departments
                .SingleOrDefaultAsync(d => d.ManagerId == department.ManagerId);

            if (existingDepartment != null && existingDepartment.Id != department.Id)
            {
                throw new InvalidOperationException("This employee is already managing another department.");
            }

            var oldManager = target.Manager;
            if (oldManager?.EmployeeRole?.RoleId == 2) // Assuming RoleId 2 is the manager role
            {
                // Change the old manager's role to RoleId = 3 (non-manager role)
                oldManager.EmployeeRole.RoleId = 3;
            }

            var manager = await _context.Employees
                .Include(e => e.EmployeeRole)
                .SingleOrDefaultAsync(e => e.Id == department.ManagerId);

            if (manager == null)
            {
                throw new InvalidOperationException("Manager not found in the database");
            }

            if (manager.EmployeeRole?.RoleId == 3) // Assuming RoleId 3 is a non-manager role
            {
                // Change the role to manager
                manager.EmployeeRole.RoleId = 2;
            }

            // Update the department details
            target.Name = department.Name;
            target.ManagerId = department.ManagerId;

            await _context.SaveChangesAsync();

            // Prepare the return object
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
                .Include(d => d.Manager)
                .Select(d => new DepartmentDTO
                {
                    Id = d.Id,
                    ManagerId = d.ManagerId,
                    ManagerName = d.Manager.Name,
                    ManagerSurname = d.Manager.Surname,
                    Name = d.Name,
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
