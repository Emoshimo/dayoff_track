using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DayOffTypesController : ControllerBase
    {
        private readonly IDayOffTypesRepository _dayOffTypesRepository;

        public DayOffTypesController(IDayOffTypesRepository dayOffTypesRepository)
        {
            _dayOffTypesRepository = dayOffTypesRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDayOffTypes()
        {
            var response = await _dayOffTypesRepository.GetAll();
            return Ok(response);
        }
    }
}
