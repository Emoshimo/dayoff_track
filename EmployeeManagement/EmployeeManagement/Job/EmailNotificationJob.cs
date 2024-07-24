using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace EmployeeManagement.Job
{
    public class EmailNotificationJob : IJob
    {
        private readonly IServiceProvider _serviceProvider;
        public EmailNotificationJob(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            using var scope = _serviceProvider.CreateScope();
            JobDataMap dataMap = context.MergedJobDataMap;
            var employeeRepository = scope.ServiceProvider.GetRequiredService<IEmployeeRepository>();
            var emailRepository = scope.ServiceProvider.GetRequiredService<IEmailRepository>();
            var managerRepository = scope.ServiceProvider.GetRequiredService<IManagerRepository>();

            var managers = await employeeRepository.GetManagers();
            foreach(var manager in managers ) 
            {
                var dayOffRequests = await managerRepository.GetDayOffRequests(manager.Id);
                foreach (var request in dayOffRequests)
                {
                    var emailRequest = new EmailRequestDTO
                    {
                        To = manager.EmailAddress,
                        Subject = "Day Off Requests Reminder.",
                        Message = $"Employee, {request.EmployeeName} {request.EmployeeSurname} has request pending for dates between {request.StartDate} and {request.EndDate}"
                    };
                    await emailRepository.SendEmail(emailRequest);
                }
            }

        }
    }
}
