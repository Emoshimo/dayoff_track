using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    // aiea cfea vsqt gvoo

    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailRepository _emailRepository;
        public EmailController(IEmailRepository emailRepository)
        {
            _emailRepository = emailRepository;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequestDTO request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.To) || string.IsNullOrWhiteSpace(request.Subject) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Invalid email request.");
            }

            try
            {
                await _emailRepository.SendEmail(request);
                return Ok("Email sent successfully.");
            }
            catch (Exception ex)
            {
                // Log the exception (consider using a logging framework)
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
