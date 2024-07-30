using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;

namespace EmployeeManagement.Services
{
    public class DayOffRequestService : IDayOffRequestService
    {
        private readonly IDayOffRequestRepository _dayOffRequestRepository;

        public DayOffRequestService(IDayOffRequestRepository dayOffRequestrepository)
        {
            _dayOffRequestRepository = dayOffRequestrepository;
        }

        public Task<IEnumerable<DayOffRequest>> GetApprovedDayOffsCache(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<DayOffRequest>> GetRejectedDayOffsCache(int id)
        {
            throw new NotImplementedException();
        }
    }
}
