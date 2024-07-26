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
            int totalDayOff = GetWorkingDays(startDate, endDate);

            if (employee.RemainingDayOffs < totalDayOff)
            {
                throw new InvalidOperationException("Insufficient remaining day offs.");

            }
            if (dayOffType == 2)
            {
                employee.RemainingDayOffs = employee.RemainingDayOffs - totalDayOff;
                //_context.Entry(employee).State = EntityState.Modified;
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

        private static int GetWorkingDays(DateOnly startDate, DateOnly endDate)
        {
            int workingDays = 0;
            if (startDate > endDate)
            {
                var temp = startDate;
                startDate = endDate;
                endDate = temp;
            }
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
                var startDate = request.StartDate;
                var endDate = request.EndDate;
                int workingDays = GetWorkingDays(startDate, endDate);
                employee.RemainingDayOffs = employee.RemainingDayOffs + workingDays;
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
                RemainingDayOffs = employee.RemainingDayOffs,
                StartDate = employee.StartDate
            };
            return clientEmployee;
        }
        public async Task<Employee> GetEmployee(int id)
        {
            return await _context.Employees.FindAsync(id);
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

        public async Task UpdateRemainingDayOffsOnAnniversary(Employee employee)
        {
            var yearsWorked = DateOnly.FromDateTime(DateTime.UtcNow).Year - employee.StartDate!.Value.Year;
            if (yearsWorked > 0)
            {
                if (yearsWorked <= 5)
                {
                    employee.RemainingDayOffs += 14;
                }
                else if (yearsWorked <= 15)
                {
                    employee.RemainingDayOffs += 20;
                }
                else
                {
                    employee.RemainingDayOffs += 26;
                }
            }
            var emp = await  _context.Employees.FindAsync(employee.Id);
            emp.RemainingDayOffs += employee.RemainingDayOffs;
            await _context.SaveChangesAsync();
        }


        /*
        public async Task<bool> DeleteEmployee(string id)
        {
            var employee = await _userManager.FindByIdAsync(id);
            if (employee == null) 
            {
                return false;
            }
            var result = await _userManager.DeleteAsync(employee);
            if (!result.Succeeded)
            {
                return false;
            }
            await _context.SaveChangesAsync();
            return true;
        }
    
        public async Task<GeneralResponse> AssignManagerRole(string employeeId)
        {
            var employee = await _userManager.FindByIdAsync(employeeId);
            if (employee == null)
            {
                return new GeneralResponse(false, "Employee not found");
            }

            var result = await _userManager.AddToRoleAsync(employee, "Manager");
            if (result.Succeeded)
            {
                return new GeneralResponse(true, "Manager role assigned");
            }

            return new GeneralResponse(false, "Failed to assign manager role");
        }
    */
    }

}
