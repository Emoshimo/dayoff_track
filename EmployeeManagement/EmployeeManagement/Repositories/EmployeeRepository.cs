using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Services;
using EmployeeManagement.Services.EmployeeCacheService;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;
        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<ClientEmployee>> GetEmployees()
        {
            var employees = await _context.Employees
                .OrderBy(e => e.Id)
                .ToListAsync();

            var clientEmployees = employees.Select(e => new ClientEmployee
            {
                Id = e.Id,
                ManagerId = e.ManagerId,
                Name = e.Name,
                Surname = e.Surname,
            }).ToList();
            return clientEmployees;
        }
        public IQueryable<Employee> GetAll()
        {
            var employees = _context.Employees;
            return employees;
        }
        public async Task<Employee> GetManagerAsync(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null || employee.ManagerId == null)
            {
                return null;
            }
            return await _context.Employees.FindAsync(employee.ManagerId);
        }
        public async Task<Employee> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return null;
            }
            return await _context.Employees.FindAsync(id);
        }
        public async Task<IEnumerable<Employee>> GetManagers()
        {
            var managerIds= await _context.Employees
                .Where(e => e.ManagerId.HasValue)
                .Select(e => e.ManagerId)
                .Distinct()
                .ToListAsync();
            var managers = await _context.Employees
                .Where(e => managerIds.Contains(e.Id))
                .ToListAsync();
            Console.WriteLine(managers);
            return managers;

        }
        public async Task<ClientEmployee> GetEmployeeById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            var clientEmployee = new ClientEmployee
            {
                Id = employee.Id,
                ManagerId = employee.ManagerId,
                Name = employee.Name,
                Surname = employee.Surname,
                StartDate = employee.StartDate
            };
            return clientEmployee;
        }
        public async Task UpdateEmployee(ClientEmployee employee)
        {
            var target = await _context.Employees.FindAsync(employee.Id);
            if (target != null)
            {
                // Update the properties of the target entity
                target.Name = employee.Name;
                target.Surname = employee.Surname;
                target.ManagerId = employee.ManagerId;
                target.StartDate = employee.StartDate;

                // Mark the target entity as modified
                _context.Entry(target).State = EntityState.Modified;

                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<DayOffRequest>> GetPendingDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var pendingDayOffs = await _context.DayOffRequests
                                .OrderBy(rq => rq.StartDate)   
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Pending")
                                .ToListAsync();

            return pendingDayOffs;
        }
        public async Task<IEnumerable<DayOffRequest>> GetApprovedDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var approvedDayOffs = await _context.DayOffRequests
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Approved")
                                .ToListAsync();

            return approvedDayOffs;
        }
        public async Task<IEnumerable<DayOffRequest>> GetRejectedDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return null;
            }
            var rejectedDayOffs = await _context.DayOffRequests
                                .Where(rq => rq.EmployeeId == employeeId && rq.Status == "Rejected")
                                .ToListAsync();

            return rejectedDayOffs;
        }
        public async Task<List<Employee>> GetAllEmployeesExcept(int employeeId)
        {
            return await _context.Employees
                .Where(e => e.Id != employeeId)
                .ToListAsync();
        }
        public async Task<List<Employee>> GetDirectSubordinates(int managerId)
        {
            return await _context.Employees
                .Where(e => e.ManagerId == managerId)
                .ToListAsync();
        }
    }
}
