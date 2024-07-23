using Quartz;

namespace EmployeeManagement.Jobs
{
    public class DynamicJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            Console.WriteLine($"Job executed: {context.JobDetail.Key.Name} at {DateTime.Now}");
            return Task.CompletedTask;
        }
    }
}
