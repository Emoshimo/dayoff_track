using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using Microsoft.Extensions.Caching.Memory;

namespace EmployeeManagement.Services
{

    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _memoryCache;
        public CacheService(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        public T GetOrCreate<T>(string cacheKey, Func<T> creator)
        {
            Console.WriteLine($"Checking cache for key: {cacheKey}");

            if (_memoryCache.TryGetValue(cacheKey, out T cacheEntry))
            {
                Console.WriteLine("Cache Hit");
                return cacheEntry;
            }

            Console.WriteLine("Cache Miss");

            cacheEntry = creator();

                if (cacheEntry != null)
                {
                    Console.WriteLine("Caching new item");

                    var cacheOptions = new MemoryCacheEntryOptions
                    {
                        SlidingExpiration = TimeSpan.FromSeconds(45),
                    };
                    _memoryCache.Set(cacheKey, cacheEntry, cacheOptions);
                }

            return cacheEntry;
        }



    }
}
