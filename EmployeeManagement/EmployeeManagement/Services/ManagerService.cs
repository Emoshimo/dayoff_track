using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using EmployeeManagement.Repositories;
using EmployeeManagement.Utils;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Services
{
    public class ManagerService : IManagerService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDayOffRequestRepository _dayOffRequestRepository;
        private readonly IEmployeeService _employeeService;
        private readonly IManagerRepository _managerRepository;

        public ManagerService(
            IEmployeeRepository employeeRepository,
            IDayOffRequestRepository dayOffRequestRepository,
            IEmployeeService employeeService,
            IManagerRepository managerRepository)
        {
            _employeeRepository = employeeRepository;
            _dayOffRequestRepository = dayOffRequestRepository;
            _employeeService = employeeService;
            _managerRepository = managerRepository;
        }
        public async Task<IEnumerable<DayOffRequestForManager>> GetDayOffRequests(int managerId)
        {
            var manager = await _employeeRepository.GetEmployee(managerId);
            if (manager == null)
            {
                return null;
            }

            var pendingRequests = _dayOffRequestRepository.GetPendingRequests(managerId);

            var result = from request in pendingRequests
                         join employee in _employeeRepository.GetAll()
                         on request.EmployeeId equals employee.Id
                         select new DayOffRequestForManager
                         {
                             Id = request.Id,
                             EmployeeName = employee.Name,
                             EmployeeSurname = employee.Surname,
                             StartDate = request.StartDate,
                             EndDate = request.EndDate
                         };

            return result;
        }

        public async Task<int> EvaluateDayOff(int dayOffRequestId, int rdo, bool approved)
        {
            int newRDO = rdo;
            var dayOffRequest = await _dayOffRequestRepository.GetDayOffRequestById(dayOffRequestId);
            if (dayOffRequest == null)
            {
                throw new ArgumentException("Day off request not found.");
            }

            if (dayOffRequest.Status != "Pending")
            {
                throw new InvalidOperationException($"Day off request with ID {dayOffRequestId} cannot be evaluated as it is not pending.");
            }

            ClientEmployee evaluatingManager = null;
            if (dayOffRequest.PendingManagerId.HasValue)
            {
                evaluatingManager = await _employeeRepository.GetEmployeeById(dayOffRequest.PendingManagerId.Value);
            }
            else
            {
                throw new InvalidCastException("This day off request has no manager.");
            }
            if (evaluatingManager?.ManagerId != null)
            {
                if (!approved)
                {
                    dayOffRequest.Status = "Rejected";
                    int RDOChange = DateUtils.GetWorkingDays(dayOffRequest.StartDate, dayOffRequest.EndDate);
                    newRDO = rdo + RDOChange;
                }
                else
                {
                    dayOffRequest.PendingManagerId = evaluatingManager.ManagerId;
                }
            }
            else
            {
                if (approved)
                {
                    dayOffRequest.Status = "Approved";
                }
                else
                {
                    dayOffRequest.Status = "Rejected";
                    int RDOChange = DateUtils.GetWorkingDays(dayOffRequest.StartDate, dayOffRequest.EndDate);
                    newRDO = rdo + RDOChange;
                }
            }

            await _dayOffRequestRepository.SaveChangesAsync();
            return newRDO;
        }

        public async Task<IEnumerable<ClientEmployee>> GetDepartmentEmployees(int managerId, int pageSize, int pageNumber)
        {
            var clientEmployees = new List<ClientEmployee>();
            var employees = await _managerRepository.GetDepartmentEmployees(managerId, pageSize, pageNumber);
            foreach (var employee in employees)
            {
                var remainingDayOffs = await _employeeService.CalculateRemainingDayOffs(employee.Id);

                var clientEmployee = new ClientEmployee
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    Surname = employee.Surname,
                    CalculatedRemainingDayOff = remainingDayOffs 
                };

                clientEmployees.Add(clientEmployee);
            }

            return clientEmployees;
        }

        public async Task<IEnumerable<ClientEmployee>> GetManagerEmployees()
        {
            var employees = await _employeeRepository.GetAll()
                .Include(e => e.EmployeeRole)
                .Where(e => e.EmployeeRole.RoleId == 2)
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
                    CalculatedRemainingDayOff = await _employeeService.CalculateRemainingDayOffs(e.Id)
                };
                clientEmployees.Add(clientEmployee);
            }
            return clientEmployees;
        }
    }
}
