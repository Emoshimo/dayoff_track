namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface IEmployeeCache
    {
        int CacheRemainingDayOff(int id, int calculateRemainingDayOff);
        void UpdateRemainingDayOff(int id, int newRemainingDayOff);
    }
}
