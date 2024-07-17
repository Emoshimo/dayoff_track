using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
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

        public EmployeeController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
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
            var response = await _employeeRepository.GetApprovedDayOffs(id);
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
            var response = await _employeeRepository.GetRejectedDayOffs(id);
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
                var response = await _employeeRepository.RequestDayOff(id, startDateOnly, endDateOnly);
                if (response == null)
                {
                    return NotFound();
                }
                return StatusCode(201, "Request has sent.");
            }
            catch (Exception ex) 
            {
                return StatusCode(500, $"An error occured while processing the request: {ex.InnerException}");
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
    }
}
