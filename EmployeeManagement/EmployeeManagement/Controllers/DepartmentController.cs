using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentController(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateDepartment(DepartmentDTO departmentDTO) 
        {
            try
            {
                var createdDepartment = await _departmentRepository.Create(departmentDTO);
                return Ok(createdDepartment);
            }

            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet]
        [Authorize(Roles="Admin")]
        public async Task<IActionResult> GetAllDepartments()
        {
            var departments = await _departmentRepository.GetAll();
            return Ok(departments);
        }
        [HttpGet("without_manager")]
        public async Task<ActionResult<DepartmentDTO>> GetDepartmentsWithoutManager()
        {
            var response = await _departmentRepository.GetDepartmentsWithoutManager();
            return Ok(response);
        }
        [HttpPut("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<DepartmentDTO>> EditDepartment(DepartmentDTO department)
        {
            try
            {
                var response = await _departmentRepository.EditDepartment(department);
                return Ok(response);
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("You are not authorized.");
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch(Exception)
            {
                return StatusCode(500, "An unexpected error occurred. Please try again later.");

            }
        }

    }
}
