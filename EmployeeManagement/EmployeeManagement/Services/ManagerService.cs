using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using EmployeeManagement.Utils;

namespace EmployeeManagement.Services
{
    public class ManagerService : IManagerService
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IDayOffRequestRepository _dayOffRequestRepository;

        public ManagerService(
            IEmployeeRepository employeeRepository,
            IDayOffRequestRepository dayOffRequestRepository)
        {
            _employeeRepository = employeeRepository;
            _dayOffRequestRepository = dayOffRequestRepository;
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
    }
}
