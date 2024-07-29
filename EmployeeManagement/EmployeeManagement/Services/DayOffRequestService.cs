using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;

namespace EmployeeManagement.Services
{
    public class DayOffRequestService : IDayOffRequestService
    {
        private readonly ICacheService _cacheService;
        private readonly IDayOffRequestRepository _dayOffRequestRepository;

        public DayOffRequestService(ICacheService cacheService,  IDayOffRequestRepository dayOffRequestrepository)
        {
            _cacheService = cacheService;
            _dayOffRequestRepository = dayOffRequestrepository;
        }
        public async Task<IEnumerable<DayOffRequest>> GetApprovedDayOffsCache(int id)
        {
            return await _cacheService.GetOrCreateAsync(
                $"Approved_Days_Of_Employee_{id}",
                () => _dayOffRequestRepository.GetApprovedDayOffs(id),
                TimeSpan.FromMinutes(15),
                TimeSpan.FromHours(1)
            );
        }
        public async Task<IEnumerable<DayOffRequest>> GetRejectedDayOffsCache(int id)
        {
            return await _cacheService.GetOrCreateAsync(
                $"Rejected_Days_Of_Employee_{id}",
                () => _dayOffRequestRepository.GetRejectedDayOffs(id),
                TimeSpan.FromMinutes(15),
                TimeSpan.FromHours(1)
            );
        }
    }
}
