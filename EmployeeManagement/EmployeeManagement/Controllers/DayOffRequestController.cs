using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DayOffRequestController : ControllerBase
    {
        private readonly IDayOffRequestRepository _dayOffRequestRepository;
        private readonly ICacheService _cacheService;
        public DayOffRequestController(
            IDayOffRequestRepository dayOffRequestRepository, 
            ICacheService cacheService)
        {
            _dayOffRequestRepository = dayOffRequestRepository;
            _cacheService = cacheService;
        }
        // GET : api/employee/dayoff/pending/{id}
        [HttpGet("dayoff/pending/{id}")]
        [Authorize(Roles = "Manager, User, Admin")]
        public async Task<ActionResult<IEnumerable<DayOffRequest>>> GetPendingDayOffs(int id)
        {
            var response = await _dayOffRequestRepository.GetPendingDayOffs(id);
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }

        // GET : api/employee/dayoff/approved/{id}
        [HttpGet("dayoff/approved/{id}")]
        [Authorize(Roles = "Manager, User, Admin")]

        public async Task<ActionResult<IEnumerable<DayOffRequest>>> GetApprovedDayOffs(int id)
        {
            var response = await _dayOffRequestRepository.GetApprovedDayOffs(id);
            if (response == null)
            {
                return NotFound();
            }
            _cacheService.GetOrCreate($"Approved_Day_Offs_Employee{id}", response);
            return Ok(response);
        }

        // GET : api/employee/dayoff/rejected/{id}
        [HttpGet("dayoff/rejected/{id}")]
        [Authorize(Roles = "Manager, User, Admin")]

        public async Task<ActionResult<IEnumerable<DayOffRequest>>> GetRejectedDayOffs(int id)
        {
            var response = await _dayOffRequestRepository.GetRejectedDayOffs(id);
            if (response == null)
            {
                return NotFound();
            }
            _cacheService.GetOrCreate($"Rejected_Day_Offs_Employee{id}", response);
            return Ok(response);
        }
    }
}
