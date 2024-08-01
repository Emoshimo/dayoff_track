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
        public async Task<ActionResult<IEnumerable<ClientEmployee>>> GetEmployees()
        {
           var employees = await _employeeRepository.GetEmployees();
           return Ok(employees);
        }
        [HttpGet("pagination")]
        public async Task<ActionResult<PaginationResponse>> GetEmployeesWithPagination(int pageNumber, int pageSize)
        {
            var TotalPages = await _employeeService.GetPageNumber(pageSize);
            var Employees = await _employeeRepository.GetEmployees(pageNumber, pageSize);
            var response = new PaginationResponse{
                employees = Employees,
                totalPageNumber = TotalPages
            };
            return Ok(response);
        }
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ClientEmployee>>> SearchEmployees(
            [FromQuery] string searchTerm,
            [FromQuery] string columnName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _employeeService.SearchEmployees(pageNumber, pageSize, searchTerm, columnName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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

            var response = await _employeeCache.CacheRemainingDayOff(id, () => _employeeService.CalculateRemainingDayOffs(id));
            if (response == -1)
            {
                return NotFound("User Not found");
            }
            return Ok(response);
        }
        
        // Returns possible Managers for a given employee id 
        // Possible Managers -> managers that won't cause a cycle in hierarchy tree
        [HttpGet("possible_managers/{id}")]
        public async Task<ActionResult<IEnumerable<ClientEmployee>>> FetchPossibleManagers(int id)
        {
            var possibleMangers = await _employeeService.GetPossibleManagersForEmployee(id);
            return Ok(possibleMangers);
        }
        // Returns A list of top X employees that took the most day offs in given date period
        [HttpGet("top_employees")]
        public async Task<ActionResult<IEnumerable<EmployeeDayOffsDTO>>> GetTopEmployees(string timePeriod, int topX)
        {
            try
            {
                var topEmployees = await _employeeService.GetTopEmployeesDayOffsAsync(timePeriod, topX);
                return Ok(topEmployees);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            
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
                var rdo = await _employeeCache.CacheRemainingDayOff(id, () => _employeeService.CalculateRemainingDayOffs(id));
                var response = await _employeeService.RequestDayOff(id ,model.DayOffTypeId, rdo, startDateOnly, endDateOnly);
                _employeeCache.UpdateRemainingDayOff(id, response);
                return StatusCode(201, "Request has sent.");
            }
            catch (ArgumentException ae)
            {
                return NotFound(ae.Message);
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
    }
}
