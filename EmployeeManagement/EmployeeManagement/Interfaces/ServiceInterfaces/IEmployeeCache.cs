namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IEmployeeCache
    {
        Task<int> CacheRemainingDayOff(int id, Func<Task<int>> creator);
        void UpdateRemainingDayOff(int id, int newRemainingDayOff);
    }
}
