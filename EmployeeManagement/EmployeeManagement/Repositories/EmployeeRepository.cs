using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
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
                RemainingDayOffs = e.RemainingDayOffs,
                ManagerId = e.ManagerId,
                Name = e.Name,
                Surname = e.Surname,
            }).ToList();
            return clientEmployees;
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
        public async Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            var remainingDayOffs = await CalculateRemainingDayOffs(employeeId);
            var anniversaryDate = new DateOnly(startDate.Year, employee.StartDate.Value.Month, employee.StartDate.Value.Day);
            bool crossesAnniversary = startDate < anniversaryDate && endDate >= anniversaryDate;
            
            if (dayOffType == 2 && crossesAnniversary)
            {
                var daysBeforeAnniversarty = GetWorkingDays(startDate, anniversaryDate) + 1;
                if (daysBeforeAnniversarty > remainingDayOffs)
                {
                    throw new InvalidCastException("Insufficient Day Off Before Annual Day Off Update");
                }

                var daysAfterAnniversary = GetWorkingDays(anniversaryDate, endDate) + 1;
                if (daysAfterAnniversary > employee.NextDayOffUpdateAmount) 
                {
                    throw new InvalidCastException("Insufficient Day Off After Annul Day Off Update");
                }
                employee.NextDayOffUpdateAmount -= daysAfterAnniversary;
            }
            else if (dayOffType == 2 && !crossesAnniversary)
            {
                int totalDays = GetWorkingDays(startDate, endDate);
                if (remainingDayOffs < totalDays) 
                {
                    throw new InvalidCastException("Insufficient Day Off");
                }
            }

            var manager = await GetManagerAsync(employeeId);
            var dayOffRequest = new DayOffRequest
            {
                EmployeeId = employeeId,
                StartDate = startDate,
                EndDate = endDate,
                PendingManagerId = manager?.Id,
                Status = "Pending",
                DayOffTypeId = dayOffType
            };
            if (manager == null)
            {
                dayOffRequest.Status = "Approved";
            }
            _context.DayOffRequests.Add(dayOffRequest);

            await _context.SaveChangesAsync();
            return dayOffRequest;
        }

        private int GetWorkingDays(DateOnly startDate, DateOnly endDate)
        {
            int workingDays = 0;
  
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                if (date.DayOfWeek != DayOfWeek.Saturday || date.DayOfWeek != DayOfWeek.Sunday)
                {
                    workingDays++;
                }
            }
            return workingDays;
        }
        public async Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds)
        {
            var targetRequests = await _context.DayOffRequests
                .Where(rq => requestIds.Contains(rq.Id))
                .ToListAsync();

            var employeeId = targetRequests[0].EmployeeId;

            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null) 
            {
                return false;
            }

            foreach (var request in targetRequests)
            {
                request.Status = "Cancelled";
            }
            await _context.SaveChangesAsync();
            return true;
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
                RemainingDayOffs = await CalculateRemainingDayOffs(id),
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
                target.RemainingDayOffs = employee.RemainingDayOffs;
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
       
        public async Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId)
        {
            // List without employee itself 
            var initialList = await _context.Employees
                .Where(e => e.Id != employeeId)
                .ToListAsync();

            if (initialList.Count == 1)
            {
                return initialList.Select(e => new ClientEmployee
                {
                    Id = e.Id,
                    RemainingDayOffs = e.RemainingDayOffs,
                    ManagerId = e.ManagerId,
                    Name = e.Name,
                    Surname = e.Surname
                });
            }
 
            var result = await RecursiveSearch(employeeId, initialList);

            return result.Select(e => new ClientEmployee
            {
                Id = e.Id,
                RemainingDayOffs = e.RemainingDayOffs,
                ManagerId = e.ManagerId,
                Name = e.Name,
                Surname = e.Surname
            });

        }
        
        private async Task<List<Employee>> RecursiveSearch (int employeeId, List<Employee> list)
        {
            var directSubordinates = await _context.Employees
                .Where(e => e.ManagerId == employeeId)
                .ToListAsync();

            if (!directSubordinates.Any())
            {
                return list;
            }
            list.RemoveAll(e => directSubordinates.Any(ds => ds.Id == e.Id));

            foreach (var subordinate in directSubordinates)
            {
                list = await RecursiveSearch(subordinate.Id, list);
            }

            return list;
        }

        public bool IsAnniversary(DateOnly startDate)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            return today.Month == startDate.Month && today.Day == startDate.Day;
        }

        public int AnniversaryDayOffAdditions(Employee employee)
        {
            int additionalDayOffs = 0;
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var yearsWorked = today.Year - employee.StartDate.Value.Year;

            if (yearsWorked > 0)
            {
                if (yearsWorked <= 5)
                {
                    additionalDayOffs += 14 * (yearsWorked);
                }
                else if (yearsWorked <= 15)
                {
                    additionalDayOffs += 20 * (yearsWorked);
                }
                else
                {
                    additionalDayOffs += 26 * (yearsWorked);
                }
            }
            if (employee.StartDate.Value.Month == today.Month && employee.StartDate.Value.Day == today.Day)
            {

                if (yearsWorked <= 5)
                {
                    employee.NextDayOffUpdateAmount = 14;
                }
                else if (yearsWorked <= 15)
                {
                    employee.NextDayOffUpdateAmount = 20;
                }
                else
                {
                    employee.NextDayOffUpdateAmount = 26;
                }
            }
            return additionalDayOffs;
        }

        public async Task<int> CalculateRemainingDayOffs(int employeeId)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            int firstRemainingDayOff = employee.RemainingDayOffs;
            var dayOffRequests = await _context.DayOffRequests
                .Where(d => d.EmployeeId == employeeId)
                .Where(d => d.Status == "Pending" || d.Status == "Approved")
                .ToListAsync();

            int dayOffs = dayOffRequests
                .Sum(d => GetWorkingDays(d.StartDate, d.EndDate));
            int anniversaryDayOffs = AnniversaryDayOffAdditions(employee);

            var remainingDayOff = firstRemainingDayOff + anniversaryDayOffs - dayOffs;
            
            return remainingDayOff;
        }

    }

}
