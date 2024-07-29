using EmployeeManagement.Data;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffRequestRepository
    {
        Task<IEnumerable<DayOffRequest>> GetDayOffRequestsByEmployeeId(int employeeId);
    }
}
