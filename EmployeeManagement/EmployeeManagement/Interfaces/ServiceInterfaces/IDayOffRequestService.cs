using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IDayOffRequestService
    {
        Task<IEnumerable<DayOffRequest>> GetApprovedDayOffsCache(int id);
        Task<IEnumerable<DayOffRequest>> GetRejectedDayOffsCache(int id);
    }
}
