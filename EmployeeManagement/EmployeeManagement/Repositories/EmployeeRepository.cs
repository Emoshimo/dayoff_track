using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Services;
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
                SupervisorId = e.SupervisorId,
                Name = e.Name,
                Surname = e.Surname,
                StartDate = e.StartDate
            }).ToList();
            return clientEmployees;
        }
        public async Task<IEnumerable<ClientEmployee>> GetEmployees(int pageNumber, int pageSize)
        {
            int skip = pageSize * (pageNumber - 1);
            var employees = await _context.Employees
                .OrderBy(e => e.Id)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var clientEmployees = employees.Select(e => new ClientEmployee
            {
                Id = e.Id,
                SupervisorId = e.SupervisorId,
                Name = e.Name,
                Surname = e.Surname,
                StartDate = e.StartDate

            }).ToList();
            return clientEmployees;

        }
        public async Task<int> GetEmployeeCount()
        {
            int count =  await _context.Employees.CountAsync();
            return count;
        }
        public IQueryable<Employee> GetAll()
        {
            var employees = _context.Employees.Include(e => e.Department);
            return employees;
        }
        public async Task<Employee> GetManagerAsync(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null || employee.SupervisorId == null)
            {
                return null;
            }
            return await _context.Employees.FindAsync(employee.SupervisorId);
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
                .Where(e => e.SupervisorId.HasValue)
                .Select(e => e.SupervisorId)
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
            var employee = await _context.Employees
                .Include(e => e.Department)
                .FirstOrDefaultAsync(e => e.Id == id);
            var clientEmployee = new ClientEmployee
            {
                Id = employee.Id,
                SupervisorId = employee.SupervisorId,
                Name = employee.Name,
                Surname = employee.Surname,
                StartDate = employee.StartDate,
                DepartmentName = employee.Department?.Name,
                
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
                target.SupervisorId = employee.SupervisorId;
                target.StartDate = employee.StartDate;

                // Mark the target entity as modified
                _context.Entry(target).State = EntityState.Modified;

                // Save changes to the database
                await _context.SaveChangesAsync();
            }
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
                .Where(e => e.SupervisorId == managerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Employee>> GetByListOfIds(IEnumerable<int> ids)
        {
            return await _context.Employees
                .Where(e => ids.Contains(e.Id))
                .ToListAsync();
        }

        public async Task DeleteEmployeById(int employeeId)
        {
            var target = await _context.Employees
                .Where(e => e.IsActive)
                .Where(e => e.Id == employeeId)
                .SingleOrDefaultAsync();
                
            if (target == null) 
            {
                throw new InvalidDataException("User is already deleted or not found.");
            }
            target.IsActive = false;
            await _context.SaveChangesAsync();
        }
    }
}
