
using EmployeeManagement.Data;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Services
{
    public class DayOffStatusUpdated : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5);

        public DayOffStatusUpdated (IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await UpdatePendingDayOffsToRejected();
                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task UpdatePendingDayOffsToRejected()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var today = DateTime.UtcNow.AddMinutes(-5);
                var requestsToReject = await context.DayOffRequests
                    .Where(r => r.Status == "Pending" && r.StartDate.ToDateTime(TimeOnly.MinValue) < today)
                    .ToListAsync();

                foreach (var request in requestsToReject)
                {
                    request.Status = "Rejected";
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
