using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _context;
        private readonly IEmployeeCache _employeeCache;

        public ManagerRepository(AppDbContext context, IEmployeeCache employeeCache)
        {
            _context = context;
            _employeeCache = employeeCache;
        }

        public async Task<IEnumerable<Employee>> GetDepartmentEmployees(int managerId, int pageSize, int pageNumber)
        {
            // Check if the user is a manager by fetching their roles
            var manager = await _context.Employees
                .Include(e => e.EmployeeRole)
                .SingleOrDefaultAsync(e => e.Id == managerId);

            if (manager == null)
            {
                throw new InvalidOperationException("Manager not found in the database");
            }

            if (manager.EmployeeRole?.RoleId != 2)
            {
                throw new UnauthorizedAccessException("The user is not authorized as a manager.");
            }

            // Fetch the department managed by this manager
            var department = await _context.Departments
                .Include(d => d.Manager)
                .SingleOrDefaultAsync(d => d.ManagerId == managerId);

            if (department == null)
            {
                throw new InvalidOperationException("The manager does not manage any department.");
            }

            // Fetch employees in the managed department with pagination
            var employees = await _context.Employees
                .Where(e => e.ManagerId == department.Id)
                .OrderBy(e => e.Id) // Assuming you want to order by ID, can be changed
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return employees;
        }

    }
}