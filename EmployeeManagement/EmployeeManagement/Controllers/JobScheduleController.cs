using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobScheduleController : ControllerBase
    {
        private readonly IJobScheduleRepository _jobScheduleRepository;
        public JobScheduleController(IJobScheduleRepository jobScheduleRepository)
        {
            _jobScheduleRepository = jobScheduleRepository;
        }
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<JobSchedule>>> GetAll()
        {
            var schedules = await _jobScheduleRepository.GetJobSchedulesAsync();
            return Ok(schedules);
        }
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<JobSchedule>> GetById(int id)
        {
            try
            {
                var target = await _jobScheduleRepository.GetJobScheduleByIdAsync(id);
                return Ok(target);

            }
            catch (InvalidDataException ex)
            {
                return NotFound("Requested JobSchedule not found!");
            }
            catch                                                                                             
            {
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateJobSchedule(JobSchedule jobSchedule)
        {
            await _jobScheduleRepository.AddJobScheduleAsync(jobSchedule);
            return Ok();

        }
        [HttpDelete]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteJobSchedule(int id)
        {
            try
            {
                await _jobScheduleRepository.DeleteJobSchedule(id);
                return Ok();
            }
            catch (InvalidCastException ex)
            {
                return NotFound($"Target Job Schedule Not Found: {ex.Message}");
            }
            catch
            {
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }
        [HttpPatch]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<JobSchedule>> UpdateJobSchedule(JobSchedule jobSchedule)
        {
            try
            {
                var updatedSchedule = await _jobScheduleRepository.UpdateJobSchedule(jobSchedule);
                return Ok(updatedSchedule);
            }
            catch (InvalidCastException ex) 
            {
                return NotFound($"Target Job Schedule Not Found: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred. Please try again later.");
            }
        }
    }
}
