using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Interfaces.ServiceInterfaces;
using EmployeeManagement.Repositories;
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
        private readonly IEmployeeService _employeeService;
        private readonly IEmployeeCache _employeeCache;

        public EmployeeController(IEmployeeRepository employeeRepository, IEmployeeService employeeService, IEmployeeCache employeeCache)
        {
            _employeeRepository = employeeRepository;
            _employeeService = employeeService;
            _employeeCache = employeeCache;
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
            var rdo = await _employeeService.CalculateRemainingDayOffs(id);
            if (rdo == -1)
            {
                return NotFound();
            }
            return await _employeeCache.CacheRemainingDayOff(id, rdo);
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

                var response = await _employeeService.RequestDayOff(id ,model.DayOffTypeId, startDateOnly, endDateOnly);
    
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
            var response = await _employeeService.CancelDayOffRequest(ids);
            if (!response)
            {
                return NotFound("Employee does not exist anymore.");
            }
            return Ok(response);
        }
        [HttpGet("possible_managers/{id}")]
        public async Task<ActionResult<IEnumerable<ClientEmployee>>> FetchPossibleManagers(int id)
        {
            var possibleMangers = await _employeeService.GetPossibleManagersForEmployee(id);
            return Ok(possibleMangers);
        }


        
    }
}
