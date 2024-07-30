namespace EmployeeManagement.Interfaces.ServiceInterfaces
{
    public interface ICacheService
    {
        T GetOrCreate<T>(string cacheKey, T values);
    }
}
