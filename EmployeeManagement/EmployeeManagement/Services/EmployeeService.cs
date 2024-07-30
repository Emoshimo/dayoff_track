using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDayOffRequestRepository _dayOffRequestRepository;
        public EmployeeService(IEmployeeRepository employeeRepository, IDayOffRequestRepository dayOffRequestRepository)
        {
            _employeeRepository = employeeRepository;
            _dayOffRequestRepository = dayOffRequestRepository;
        }
        public async Task<int> CalculateRemainingDayOffs(int employeeId)
        {
            var employee = await _employeeRepository.GetEmployee(employeeId);
            int firstRemainingDayOff = employee.RemainingDayOffs;
            var dayOffRequests = await _dayOffRequestRepository.GetDayOffRequestsByEmployeeId(employeeId);

            int dayOffs = dayOffRequests
                .Sum(d => GetWorkingDays(d.StartDate, d.EndDate));
            int anniversaryDayOffs = AnniversaryDayOffAdditions(employee);

            var remainingDayOff = firstRemainingDayOff + anniversaryDayOffs - dayOffs;
                
            return remainingDayOff;
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
        public async Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds)
        {
            var targetRequests = await _dayOffRequestRepository.GetDayOffRequestsByIds(requestIds);
            var targetRequestsList = targetRequests.ToList();

            var cancelledDayOffs = 0;
            var employeeId = targetRequestsList[0].EmployeeId;

            var employee = await _employeeRepository.GetEmployee(employeeId);
            if (employee == null)
            {
                return false;
            }

            foreach (var request in targetRequests)
            {
                request.Status = "Cancelled";
                cancelledDayOffs += GetWorkingDays(request.StartDate, request.EndDate);
            }
            int remainingDayOffs = await CalculateRemainingDayOffs(employeeId);
            int newRDO = remainingDayOffs + cancelledDayOffs;
            //_employeeCache.UpdateRemainingDayOff(employeeId, newRDO);
            await _dayOffRequestRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId)
        {
            // List without the employee itself 
            var initialList = await _employeeRepository.GetAllEmployeesExcept(employeeId);

            if (initialList.Count == 1)
            {
                return initialList.Select(e => new ClientEmployee
                {
                    Id = e.Id,
                    ManagerId = e.ManagerId,
                    Name = e.Name,
                    Surname = e.Surname
                });
            }

            var result = await RecursiveSearch(employeeId, initialList);

            return result.Select(e => new ClientEmployee
            {
                Id = e.Id,
                ManagerId = e.ManagerId,
                Name = e.Name,
                Surname = e.Surname
            });
        }

        private async Task<List<Employee>> RecursiveSearch(int employeeId, List<Employee> list)
        {
            var directSubordinates = await _employeeRepository.GetDirectSubordinates(employeeId);

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
        public int GetWorkingDays(DateOnly startDate, DateOnly endDate)
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

        public bool IsAnniversary(DateOnly startDate)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            return today.Month == startDate.Month && today.Day == startDate.Day;
        }

        public async Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate)
        {
            var employee = await _employeeRepository.GetEmployee(employeeId);
            var remainingDayOffs = await CalculateRemainingDayOffs(employeeId);
            var anniversaryDate = new DateOnly(startDate.Year, employee.StartDate.Value.Month, employee.StartDate.Value.Day);
            bool crossesAnniversary = startDate < anniversaryDate && endDate >= anniversaryDate;

            if (dayOffType == 2 && crossesAnniversary)
            {
                var daysBeforeAnniversary = GetWorkingDays(startDate, anniversaryDate) + 1;
                if (daysBeforeAnniversary > remainingDayOffs)
                {
                    throw new InvalidCastException("Insufficient Day Off Before Annual Day Off Update");
                }
                var newRDO = remainingDayOffs - daysBeforeAnniversary;
                //_employeeCache.UpdateRemainingDayOff(employeeId, newRDO);

                var daysAfterAnniversary = GetWorkingDays(anniversaryDate, endDate) + 1;
                if (daysAfterAnniversary > employee.NextDayOffUpdateAmount)
                {
                    throw new InvalidCastException("Insufficient Day Off After Annual Day Off Update");
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
                int newRDO = remainingDayOffs - totalDays;
                //_employeeCache.UpdateRemainingDayOff(employeeId, newRDO);
            }

            var manager = await _employeeRepository.GetManagerAsync(employeeId);
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
            await _dayOffRequestRepository.AddDayOffRequest(dayOffRequest);

            await _dayOffRequestRepository.SaveChangesAsync();
            return dayOffRequest;
        }

        public async Task<int> CacheDayOffs(int id)
        {
            var newRDO = await CalculateRemainingDayOffs(id);
            CacheRemainingDayOff(id, newRDO);
            return newRDO;
        }
        public void CacheRemainingDayOff(int id, int newCacheEntry)
        {
           return;
        }
    }
}
