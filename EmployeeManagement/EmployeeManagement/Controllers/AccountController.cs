using BCrypt.Net;
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
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IEmployeeService _employeeService;

        public AccountController(IAccountRepository accountRepository, IEmployeeService employeeService)
        {
            _accountRepository = accountRepository;
            _employeeService = employeeService;
        }

        [HttpPost("register")]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> Register([FromBody]EmployeeDTO employeeDTO) 
        {
            if (!DateTime.TryParseExact(employeeDTO.StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedStartDate))
            {
                return BadRequest("Invalid date format. Expected format: yyyy-MM-dd.");
            }
            var startDateOnly = new DateOnly(parsedStartDate.Year, parsedStartDate.Month, parsedStartDate.Day);

            var response = await _accountRepository.CreateEmployeeAsync(employeeDTO, startDateOnly);
            if (!response.flag) 
            {
                return BadRequest(response.Message);
            }
            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var response = await _accountRepository.Login(loginDTO);
            if (response.flag)
            {
                return Ok(response);
            }
            return BadRequest(response.Message);
        }

        [HttpPatch("edit/{id}")]
        [Authorize(Roles="Admin")]
        public async Task<ActionResult<ClientEmployee>> UpdateEmployee(ClientEmployee employee)
        {
            try
            {
                var possibleManagers = await _employeeService.GetPossibleManagersForEmployee(employee.Id);

                // Check if manIg is a possible manager
                if (!possibleManagers.Any(m => m.Id == employee.ManagerId))
                {
                    return NotFound($"Manager with ID {employee.ManagerId} is not a possible manager for employee as it creates cycle.");
                }
                var response = await _accountRepository.EditEmployee(employee);
                return Ok(response);
            }
            catch (InvalidDataException ex)
            {
                return NotFound($"{ex.Message}!");
            }

        }
    }
}
