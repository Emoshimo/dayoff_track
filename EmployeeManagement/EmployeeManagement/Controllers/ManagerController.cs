using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
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
        private readonly IManagerService _managerService;
        private readonly IEmployeeCache _employeeCache;
        private readonly IEmployeeService _employeeService;

        public ManagerController(IManagerRepository managerRepository, IManagerService managerService, IEmployeeCache employeeCache, IEmployeeService employeeService)
        {
            _managerRepository = managerRepository;
            _managerService = managerService;
            _employeeCache = employeeCache;
            _employeeService = employeeService;
        }
        // POST: api/Manager/dayoff/{id}
        [HttpPost("dayoff/{id}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<DayOffRequest>> EvaluateDayOff(int id,[FromBody] bool approved)
        {
            try
            {
                var rdo = await _employeeCache.CacheRemainingDayOff(id, () =>_employeeService.CalculateRemainingDayOffs(id));
                var response = await _managerService.EvaluateDayOff(id, rdo, approved);
                return StatusCode(201, response);
            }
            catch(InvalidCastException ice)
            {
                return NotFound(ice.Message);
            }
            catch (ArgumentException ae)
            {
                return NotFound(ae.Message);
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
                var response = await _managerService.GetDayOffRequests(managerId);
                if (response == null)
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