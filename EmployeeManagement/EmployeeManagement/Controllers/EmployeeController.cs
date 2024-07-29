using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ICacheService _cacheService;
        public EmployeeController(IEmployeeRepository employeeRepository, ICacheService cacheService)
        {
            _employeeRepository = employeeRepository;
            _cacheService = cacheService;
        }
        // GET: api/employee
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {

           var employees = await _employeeRepository.GetEmployees();
           return Ok(employees);

        }
        // GET : api/employee/get
        [HttpGet("{id}")]
        [Authorize(Roles = "User, Manager, Admin")]
        public async Task<ActionResult<ClientEmployee>> GetEmployee(int id)
        {
            var employee = await _employeeRepository.GetEmployeeById(id);
            if (employee == null)
            {
                return NotFound();
            }
            return employee;
        }

        [HttpGet("{id}/remaining_day_off")]
        public async Task<ActionResult<int>> GetRemainingDayOff(int id)
        {
            return Ok(await _employeeRepository.CacheRemainingDayOff(id));
        }

        // GET : api/employee/dayoff/pending/{id}
        [HttpGet("dayoff/pending/{id}")]
        [Authorize(Roles = "Manager, User, Admin")]
        public async Task<ActionResult<IEnumerable<DayOffRequest>>> GetPendingDayOffs(int id)
        {
            var response = await _employeeRepository.GetPendingDayOffs(id);
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
            var response = await GetApprovedDayOffsCache(id);
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }        
        
        // GET : api/employee/dayoff/rejected/{id}
        [HttpGet("dayoff/rejected/{id}")]
        [Authorize(Roles = "Manager, User, Admin")]

        public async Task<ActionResult<IEnumerable<DayOffRequest>>> GetRejectedDayOffs(int id)
        {
            var response = await GetRejectedDayOffsCache(id);
            if (response == null)
            {
                return NotFound();
            }
            return Ok(response);
        }

        // POST: api/Employee/dayoff/{id}
        [HttpPost("dayoff/{id}")]
        [Authorize(Roles = "Manager, User")]
        public async Task<ActionResult<DayOffRequest>> RequestDayOff(int id, [FromBody] DayOffRequestModel model)
        {
            if (!DateTime.TryParseExact(model.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedStartDate))
            {
                return BadRequest("Invalid date format. Expected format: yyyy-MM-dd.");
            }
            if (!DateTime.TryParseExact(model.EndDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedEndDate))
            {
                return BadRequest("Invalid date format. Expected format: yyyy-MM-dd.");
            }

            var startDateOnly = new DateOnly(parsedStartDate.Year, parsedStartDate.Month, parsedStartDate.Day);
            var endDateOnly = new DateOnly(parsedEndDate.Year, parsedEndDate.Month, parsedEndDate.Day);
            try
            {
                var employee = await _employeeRepository.GetEmployeeById(id);
                if (employee == null)
                {
                    return NotFound("Employee not found.");
                }

                var response = await _employeeRepository.RequestDayOff(id ,model.DayOffTypeId, startDateOnly, endDateOnly);
    
                return StatusCode(201, "Request has sent.");
            }
            catch (Exception ex) 
            {
                return StatusCode(500, $"An error occured while processing the request: {ex.Message}");
            }
        }


        [HttpPatch("dayoff/cancel")]
        [Authorize(Roles ="User")]
        public async Task<IActionResult> CancelDayOff(IEnumerable<int> ids)
        {
            var response = await _employeeRepository.CancelDayOffRequest(ids);
            if (!response)
            {
                return NotFound("Employee does not exist anymore.");
            }
            return Ok(response);
        }
        [HttpGet("possible_managers/{id}")]
        public async Task<ActionResult<IEnumerable<ClientEmployee>>> FetchPossibleManagers(int id)
        {
            var possibleMangers = await _employeeRepository.GetPossibleManagersForEmployee(id);
            return Ok(possibleMangers);
        }

        private async Task<IEnumerable<DayOffRequest>> GetApprovedDayOffsCache(int id)
        {
            return await _cacheService.GetOrCreateAsync(
                $"Approved_Days_Of_Employee_{id}",
                () => _employeeRepository.GetApprovedDayOffs(id),
                TimeSpan.FromMinutes(15),
                TimeSpan.FromHours(1)
            );
        }
        private async Task<IEnumerable<DayOffRequest>> GetRejectedDayOffsCache(int id)
        {
            return await _cacheService.GetOrCreateAsync(
                $"Rejected_Days_Of_Employee_{id}",
                () => _employeeRepository.GetRejectedDayOffs(id),
                TimeSpan.FromMinutes(15),
                TimeSpan.FromHours(1)
            );
        }
        
    }
}
