using BCrypt.Net;
using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountRepository _accountRepository;

        public AccountController(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        [HttpPost("register")]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> Register(EmployeeDTO employeeDTO) 
        {
            var response = await _accountRepository.CreateEmployeeAsync(employeeDTO);
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
