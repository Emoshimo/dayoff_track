using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using EmployeeManagement.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DayOffTypesController : ControllerBase
    {
        private readonly IDayOffTypesRepository _dayOffTypesRepository;
        private readonly ICacheService _cacheService;

        public DayOffTypesController(IDayOffTypesRepository dayOffTypesRepository, ICacheService cacheService)
        {
            _dayOffTypesRepository = dayOffTypesRepository;
            _cacheService = cacheService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDayOffTypes()
        {
            var response = await CacheDayOffTypes();
            return Ok(response);
        }

        private async Task<IEnumerable<DayOffType>> CacheDayOffTypes()
        {
            return await _cacheService.GetOrCreateAsync(
            "DayOff_Types",
            () => _dayOffTypesRepository.GetAll(),
            TimeSpan.FromHours(12),
            TimeSpan.FromHours(24)
            );
        }
    }
}
