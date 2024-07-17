using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerRepository _managerRepository;

        public ManagerController(IManagerRepository managerRepository)
        {
            _managerRepository = managerRepository;
        }
        // POST: api/Manager/dayoff/{id}
        [HttpPost("dayoff/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<DayOffRequest>> EvaluateDayOff(int id, bool approved)
        {
            try
            {
                var response = await _managerRepository.EvaluateDayOff(id, approved);
                if (response == null)
                {
                    return NotFound();
                }
                return StatusCode(201, "Request Evaluated.");
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(401, "Unauthorized access");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occured while processing the request: {ex.Message}");
            }
        }

        // GET: api/Manager/dayoff/
        [HttpGet("dayoff/{managerId}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<IEnumerable<DayOffRequestForManager>>> GetEmployeeDayOffs(int managerId)
        {
            try
            {
                var response = await _managerRepository.GetDayOffRequests(managerId);
                if (response == null )
                {
                    return NotFound();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occured while fetching day offs: {ex.Message}");
            }
        }
    }
}