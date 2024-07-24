using EmployeeManagement.Interfaces;
using EmployeeManagement.Job;
using Quartz;

namespace EmployeeManagement.Services
{
    public static class QuartzConfigurationService
    {
        public static void ConfigureQuartz(this IServiceCollection services) 
        {
            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionJobFactory();
            });
            services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
            services.AddTransient<EmailNotificationJob>();
        }

        public static async Task ScheduleFromDataBase(IServiceProvider serviceProvider)
        {
            var schedulerFactory = serviceProvider.GetService<ISchedulerFactory>();
            var scheduler = await schedulerFactory.GetScheduler();
            var jobScheduleRepository = serviceProvider.GetRequiredService<IJobScheduleRepository>();

            var jobSchedules = await jobScheduleRepository.GetJobSchedulesAsync();
            foreach (var jobSchedule in jobSchedules)
            {
                Console.WriteLine(jobSchedule.JobKey);
                IJobDetail jobDetail = jobSchedule.JobKey switch
                {
                    "EmailNotificationJob" => JobBuilder.Create<EmailNotificationJob>()
                    .WithIdentity(jobSchedule.JobKey, jobSchedule.Group)
                    .Build(),

                    _ => throw new ArgumentException($"Unknown Job Key: {jobSchedule.JobKey}")
                };

                ITrigger trigger = TriggerBuilder.Create()
                    .WithIdentity($"{jobSchedule.JobKey}.trigger", jobSchedule.Group)
                    .WithCronSchedule((jobSchedule.CronExpression))
                    .ForJob(jobDetail)
                    .Build();

                await scheduler.ScheduleJob(jobDetail, trigger);

            }
            Console.WriteLine("Hello Initialization is finished!");
            Console.WriteLine(jobSchedules.Count());

        }
    }
}
