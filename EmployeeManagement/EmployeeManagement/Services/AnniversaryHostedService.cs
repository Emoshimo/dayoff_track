

using EmployeeManagement.Data;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Services
{
    public class AnniversaryHostedService : IHostedService, IDisposable
    {
 
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AnniversaryHostedService> _logger;
        private Timer _timer;
        public AnniversaryHostedService(IServiceProvider serviceProvider, ILogger<AnniversaryHostedService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Anniversary Hosted Service starting.");
            // Schedule the task to run once a day at a specific time
            var firstRunTime = DateTime.Today.AddHours(13).AddMinutes(45); // For example, run at 13:45
            var currentTime = DateTime.Now;
            var initialDelay = firstRunTime > currentTime
                ? firstRunTime - currentTime
                : firstRunTime.AddDays(1) - currentTime;

            _timer = new Timer(ExecuteTask, null, initialDelay, TimeSpan.FromDays(1));
            return Task.CompletedTask;
        }
        private async void ExecuteTask(object state)
        {
            _logger.LogInformation("Executing anniversary job at: {time}", DateTimeOffset.Now);
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var today = DateOnly.FromDateTime(DateTime.Today);
            var employees = await dbContext.Employees
                .Where(e => e.StartDate.HasValue && e.StartDate.Value.Day == today.Day && e.StartDate.Value.Month == today.Month)
                .ToListAsync();

            foreach (var employee in employees)
            {
                int yearsWorked = today.Year - employee.StartDate!.Value.Year;
                if (1 < yearsWorked && yearsWorked <= 5)
                {
                    employee.RemainingDayOffs += 14;
                }
                else if (5 < yearsWorked && yearsWorked <= 15)
                {
                    employee.RemainingDayOffs += 20;
                }
                else
                {
                    employee.RemainingDayOffs += 26;
                }
            }

            await dbContext.SaveChangesAsync();
        }
        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Anniversary Hosted Service stopping.");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
