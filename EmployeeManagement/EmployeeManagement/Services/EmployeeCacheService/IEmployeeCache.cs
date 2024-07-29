namespace EmployeeManagement.Services.EmployeeCacheService
{
    public interface IEmployeeCache
    {
        Task<int> CacheRemainingDayOff(int id, Func<Task<int>> calculateRemainingDayOff);
        void UpdateRemainingDayOff(int id, int newRemainingDayOff);
    }
}
