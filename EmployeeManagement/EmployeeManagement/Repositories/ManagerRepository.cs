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
            // Fetch the department managed by the manager using the navigation property
            var department = await _context.Departments
                                           .Include(d => d.Employees)
                                           .FirstOrDefaultAsync(d => d.ManagerId == managerId);

            if (department == null)
            {
                return Enumerable.Empty<Employee>(); // Return an empty list if the department is not found
            }

            // Fetch the employees of the department managed by this manager with pagination
            var employees = department.Employees
                                      .Skip((pageNumber - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToList();
            return employees;
        }
        public async Task<int> GetTotalDepartmentEmployeeCount(int managerId)
        {
            // Find the manager and get their department ID
            var manager = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == managerId);

            if (manager == null || manager.DepartmentId == null)
            {
                return 0;
            }

            // Count the number of employees in that department
            var totalEmployees = await _context.Employees
                .Where(e => e.DepartmentId == manager.DepartmentId)
                .CountAsync();

            return totalEmployees;
        }

    }
}