using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace EmployeeManagement.Services
{

    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        public CacheService(IMemoryCache memoryCache, IEmployeeRepository employeeRepository)
        {
            _memoryCache = memoryCache;
        }

        public async Task<T> GetOrCreateAsync<T>(string cacheKey, Func<Task<T>> createItem, TimeSpan? slidingExpiration = null, TimeSpan? absoluteExpiration = null)
        {
            Console.WriteLine($"Checking cache for key: {cacheKey}");

            if (_memoryCache.TryGetValue(cacheKey, out T cacheEntry))
            {
                Console.WriteLine("Cache Hit");
                return cacheEntry;
            }

            Console.WriteLine("Cache Miss");

            cacheEntry = await createItem();

                if (cacheEntry != null)
                {
                    Console.WriteLine("Caching new item");

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        SlidingExpiration = slidingExpiration ?? TimeSpan.FromMinutes(5),
                        AbsoluteExpirationRelativeToNow = absoluteExpiration ?? TimeSpan.FromMinutes(15)
                    };
                    _memoryCache.Set(cacheKey, cacheEntry, cacheOptions);
                }

            return cacheEntry;
        }



    }
}
