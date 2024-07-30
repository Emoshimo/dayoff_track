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
        public int CacheRemainingDayOff(int id, int calculateRemainingDayOff)
        {
            string cacheKey = $"Remaining_Day_Of_Employee_{id}";
            if (_memoryCache.TryGetValue(cacheKey, out int cacheEntry))
            {
                Console.WriteLine("Remaining Day Off Cache Hit");
                return cacheEntry;
            }
            Console.WriteLine("Remaining Day off Cache Miss");


            cacheEntry = calculateRemainingDayOff;

            Console.WriteLine("Caching new remaining day off item");
            _memoryCache.Set(cacheKey, cacheEntry, GetMemoryOptionsForRemainingDayOff());
            return cacheEntry;
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
                SlidingExpiration = TimeSpan.FromMinutes(45),
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(3),
                Size = 2
            };
            return cacheOptions;
        }
    }
}
