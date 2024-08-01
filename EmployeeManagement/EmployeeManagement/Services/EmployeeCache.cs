using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using Microsoft.Extensions.Caching.Memory;

namespace EmployeeManagement.Services
{
    public class EmployeeCache : IEmployeeCache
    {
        //private readonly IEmployeeRepository _employeeRepository;
        private readonly IMemoryCache _memoryCache;

        public EmployeeCache(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }
        static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1);

        public async Task<int> CacheRemainingDayOff(int id, Func<Task<int>> creator)
        {
            string cacheKey = $"Remaining_Day_Of_Employee_{id}";
            if (_memoryCache.TryGetValue(cacheKey, out int cacheEntry))
            {
                Console.WriteLine("Remaining Day Off Cache Hit");
                return cacheEntry;
            }
            await semaphoreSlim.WaitAsync();
            try
            {
                cacheEntry = await creator();

                Console.WriteLine("Caching new remaining day off item");

                _memoryCache.Set(cacheKey, cacheEntry, GetMemoryOptionsForRemainingDayOff());
                return cacheEntry;
            }
            catch (Exception ex) 
            {
                throw new Exception($"Caching Exception: ${ex.Message}  ${ex.InnerException}");
            }
            finally
            {
                semaphoreSlim.Release();
            }
        }

        public void UpdateRemainingDayOff(int id, int newRemainingDayOff)
        {
            string cacheKey = $"Remaining_Day_Of_Employee_{id}";
            _memoryCache.Set(cacheKey, newRemainingDayOff, GetMemoryOptionsForRemainingDayOff());
            Console.WriteLine("Updated remaining day off cache");
        }

        private static MemoryCacheEntryOptions GetMemoryOptionsForRemainingDayOff()
        {
            var cacheOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromSeconds(45),
            };
            return cacheOptions;
        }
    }
}
