namespace EmployeeManagement.Interfaces
{
    public interface ICacheService
    {
        Task<T> GetOrCreateAsync<T>(string cacheKey, Func<Task<T>> createItem, TimeSpan? slidingExpiration = null, TimeSpan? absoluteExpiration = null);
    }
}
