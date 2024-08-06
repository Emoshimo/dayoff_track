using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using EmployeeManagement.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Globalization;
using System.Linq.Expressions;

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
            if (employee != null)
            {
                int firstRemainingDayOff = employee.RemainingDayOffs;
                var dayOffRequests = await _dayOffRequestRepository.GetDayOffRequestsByEmployeeId(employeeId);

                int dayOffs = dayOffRequests
                    .Sum(d => GetWorkingDays(d.StartDate, d.EndDate));
                int anniversaryDayOffs = AnniversaryDayOffAdditions(employee);

                var remainingDayOff = firstRemainingDayOff + anniversaryDayOffs - dayOffs;

                return remainingDayOff;
            }
            return -1;
            
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

        public async Task<int> RequestDayOff(int employeeId, int dayOffType, int remainingDayOffs, DateOnly startDate, DateOnly endDate)
        {
            var employee = await _employeeRepository.GetEmployee(employeeId);
            if (employee == null)
            {
                throw new ArgumentException("Not found");
            }
            var anniversaryDate = new DateOnly(startDate.Year, employee.StartDate.Value.Month, employee.StartDate.Value.Day);
            bool crossesAnniversary = startDate < anniversaryDate && endDate >= anniversaryDate;
            int newRDO = remainingDayOffs;
            if (dayOffType == 2 && crossesAnniversary)
            {
                var daysBeforeAnniversary = GetWorkingDays(startDate, anniversaryDate) + 1;
                if (daysBeforeAnniversary > remainingDayOffs)
                {
                    throw new InvalidCastException("Insufficient Day Off Before Annual Day Off Update");
                }
                newRDO = remainingDayOffs - daysBeforeAnniversary;

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
                newRDO = remainingDayOffs - totalDays;
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
            return newRDO;
        }

        public async Task<IEnumerable<EmployeeDayOffsDTO>> GetTopEmployeesDayOffsAsync(string timePeriod, int topN)
        {
            DateOnly endDate = DateOnly.FromDateTime(DateTime.Now);
            DateOnly startDate;

            switch (timePeriod)
            {
                case "month":
                    startDate = endDate.AddMonths(-1);
                    break;
                case "3months":
                    startDate = endDate.AddMonths(-3);
                    break;
                case "2weeks":
                    startDate = endDate.AddDays(-14);
                    break;
                default:
                    throw new ArgumentException("Invalid Time Period");
            }
            var dayOffRequests = await _dayOffRequestRepository.GetPendingAndApprovedByDates(startDate, endDate);
            // Group requests by Employee 
            var groupedData = dayOffRequests
                .GroupBy(d => d.EmployeeId)
                .Select(g => new
                {
                    EmployeeId = g.Key,
                    // Calculate the total working days for each employee
                    DayOffs = g.Sum(d => DateUtils.GetWorkingDays(d.StartDate, d.EndDate))
                })
                .OrderByDescending(g => g.DayOffs)
                .Take(topN)
                .ToList();
            var employeeIds = groupedData.Select(g => g.EmployeeId).ToList();

            var employees = await _employeeRepository.GetByListOfIds(employeeIds);

            var result = new List<EmployeeDayOffsDTO>();

            foreach (var employee in employees)
            {
                var groupedEmployee = groupedData.First(g => g.EmployeeId == employee.Id);
                result.Add(new EmployeeDayOffsDTO
                {
                    Name = employee.Name,
                    Surname = employee.Surname,
                    Days = groupedEmployee.DayOffs
                });
            }

            return result;
        }

        public async Task<PaginationResponse> SearchEmployees(int pageNumber, int pageSize,
            string nameSearchTerm, string surnameSearchTerm, int? idSearchTerm,
            int? managerIdSearchTerm, string? startDateSearchTerm, string? orderColumn, string? sortOrder)
        {
            var query = _employeeRepository.GetAll();

            if (!string.IsNullOrEmpty(nameSearchTerm))
            {
                nameSearchTerm = nameSearchTerm.ToLower();
                query = query.Where(e => EF.Functions.Like(e.Name.ToLower(), $"%{nameSearchTerm}%"));
            }

            if (!string.IsNullOrEmpty(surnameSearchTerm))
            {
                surnameSearchTerm = surnameSearchTerm.ToLower();
                query = query.Where(e => EF.Functions.Like(e.Surname.ToLower(), $"%{surnameSearchTerm}%"));
            }

            // Handle integer searches
            if (idSearchTerm.HasValue)
            {
                query = query.Where(e => e.Id == idSearchTerm.Value);
            }
            if (managerIdSearchTerm.HasValue)
            {
                query = query.Where(e => e.ManagerId == managerIdSearchTerm.Value);
            }


            // Handle date search
            if (!string.IsNullOrEmpty(startDateSearchTerm))
            {
                if (!DateTime.TryParseExact(startDateSearchTerm, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedStartDate))
                {
                    DateOnly startDate;
                    DateOnly endDate;

                    // If only the year is provided (e.g., "2021")
                    if (startDateSearchTerm.Length == 4 && int.TryParse(startDateSearchTerm, out int year))
                    {
                        startDate = new DateOnly(year, 1, 1);
                        endDate = new DateOnly(year, 12, 31);
                    }
                    // If year and month are provided (e.g., "2021-08")
                    else if (startDateSearchTerm.Length == 7 && DateTime.TryParseExact(startDateSearchTerm, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedStartDateYearMonth))
                    {
                        startDate = new DateOnly(parsedStartDateYearMonth.Year, parsedStartDateYearMonth.Month, 1);
                        endDate = startDate.AddMonths(1).AddDays(-1);
                    }
                    // If full date is provided (e.g., "2021-08-06")
                    else if (DateOnly.TryParse(startDateSearchTerm, out DateOnly parsedStartDateFull))
                    {
                        startDate = parsedStartDateFull;
                        endDate = parsedStartDateFull;
                    }
                    else
                    {
                        throw new ArgumentException("Invalid date format.");
                    }

                    query = query.Where(e => e.StartDate >= startDate && e.StartDate <= endDate);
                }
            }
            if (!string.IsNullOrEmpty(orderColumn))
            {
                var param = Expression.Parameter(typeof(Employee), "e");
                var prop = Expression.Property(param, orderColumn);
                var lamba = Expression.Lambda<Func<Employee, object>>(Expression.Convert(prop, typeof(object)), param);
                switch (sortOrder.ToLower())
                {
                    case "asc":
                        query = query.OrderBy(lamba);
                        break;
                    case "desc":
                        query = query.OrderByDescending(lamba);
                        break;
                    default:
                        break;
                }
            }
            var varPageNumber = (int)Math.Ceiling((double)query.Count() / pageSize);
            var employees = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            var clientEmployees = new List<ClientEmployee>();

            foreach (var e in employees)
            {
                var clientEmployee = new ClientEmployee
                {
                    Id = e.Id,
                    ManagerId = e.ManagerId,
                    Name = e.Name,
                    Surname = e.Surname,
                    StartDate = e.StartDate,
                    CalculatedRemainingDayOff = await CalculateRemainingDayOffs(e.Id)
                };
                clientEmployees.Add(clientEmployee);
            }

            var response = new PaginationResponse
            {
                employees = clientEmployees,
                totalPageNumber = varPageNumber
            };
            return response;
        }
        
        public async Task<int> GetPageNumber(int pageSize)
        {
            var count = await _employeeRepository.GetEmployeeCount();
            var totalPages = (int)Math.Ceiling((double)count / pageSize);
            return totalPages;
        }

    }
}
