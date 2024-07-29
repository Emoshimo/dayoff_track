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
        public Task<bool> CancelDayOffRequest(IEnumerable<int> requestIds)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ClientEmployee>> GetEmployees()
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<ClientEmployee>> GetPossibleManagersForEmployee(int employeeId)
        {
            throw new NotImplementedException();
        }

        public int GetWorkingDays(DateOnly startDate, DateOnly endDate)
        {
            throw new NotImplementedException();
        }

        public bool IsAnniversary(DateOnly startDate)
        {
            throw new NotImplementedException();
        }

        public Task<DayOffRequest> RequestDayOff(int employeeId, int dayOffType, DateOnly startDate, DateOnly endDate)
        {
            throw new NotImplementedException();
        }
    }
}
