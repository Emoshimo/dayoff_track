using EmployeeManagement.Data;
using Microsoft.EntityFrameworkCore;
using Quartz;

namespace EmployeeManagement.Jobs
{
    public class AnniversaryJob : IJob
    {
        private readonly IServiceProvider _serviceProvider;
        public AnniversaryJob (IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }
        public async Task Execute(IJobExecutionContext context)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var today = DateOnly.FromDateTime(DateTime.Today);
            //Console.WriteLine("Hello", DateTime.Now);
            var employees = await dbContext.Employees
                .Where(e => e.StartDate.HasValue && e.StartDate.Value.Day == today.Day && e.StartDate.Value.Month == today.Month)
                .ToListAsync();
            foreach(var employee in employees) 
            {
                int yearsWorked = today.Year - employee.StartDate!.Value.Year;
                if (1 < yearsWorked && yearsWorked <= 5 )
                {
                    employee.RemainingDayOffs += 14;
                } 
                else if ( 5 < yearsWorked && yearsWorked <= 15)
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
    }
}
