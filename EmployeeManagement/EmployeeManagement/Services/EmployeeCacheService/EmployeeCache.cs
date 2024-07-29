
using EmployeeManagement.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace EmployeeManagement.Services.EmployeeCacheService
{
    public class EmployeeCache : IEmployeeCache
    {
        //private readonly IEmployeeRepository _employeeRepository;
        private readonly IMemoryCache _memoryCache;
        private readonly SemaphoreSlim _cacheSemaphore = new SemaphoreSlim(1, 1);

        public EmployeeCache(IMemoryCache memoryCache) 
        { 
            _memoryCache = memoryCache;
        }
        public async Task<int> CacheRemainingDayOff(int id, Func<Task<int>> calculateRemainingDayOff)
        {
            string cacheKey = $"Remaining_Day_Of_Employee_{id}";
            if (_memoryCache.TryGetValue(cacheKey, out int cacheEntry))
            {
                Console.WriteLine("Remaining Day Off Cache Hit");
                return cacheEntry;
            }
            Console.WriteLine("Remaining Day off Cache Miss");

            await _cacheSemaphore.WaitAsync();
            try
            {
                cacheEntry = await calculateRemainingDayOff();

                Console.WriteLine("Caching new remaining day off item");
                _memoryCache.Set(cacheKey, cacheEntry, GetMemoryOptionsForRemainingDayOff());
                return cacheEntry;
            }
            finally
            {
                _cacheSemaphore.Release();
            }

        }
        public void UpdateRemainingDayOff(int id, int newRemainingDayOff)
        {
            string cacheKey = $"Remaining_Day_Of_Employee_{id}";
            _memoryCache.Set(cacheKey, newRemainingDayOff, GetMemoryOptionsForRemainingDayOff());
            Console.WriteLine("Updated remaining day off cache");
        }

        private MemoryCacheEntryOptions GetMemoryOptionsForRemainingDayOff()
        {
            var cacheOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromHours(2),
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
            };
            return cacheOptions;
        }
    }
}
