using EmployeeManagement.DTO;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Interfaces
{
    public interface IEmailRepository
    {
        Task SendEmail(EmailRequestDTO request);
    }
}
