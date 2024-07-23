using Quartz;
using Quartz.Spi;
using Quartz.Impl;
using Microsoft.Extensions.DependencyInjection;
using EmployeeManagement.Jobs;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Data;

namespace EmployeeManagement.Services
{
    public static class QuartzConfiguration 
    {
        public static void QuartzConfigurationServices(this IServiceCollection services) 
        {
            services.AddQuartz(q =>
            {
                q.UseMicrosoftDependencyInjectionJobFactory(); // Use DI job factory

            });
            services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);
            services.AddTransient<AnniversaryJob>();

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
                    "AnniversaryJob" => JobBuilder.Create<AnniversaryJob>()
                    .WithIdentity(jobSchedule.JobKey, jobSchedule.Group)
                    .Build(),

                    _ => throw new ArgumentException($"Unknown Job Key: {jobSchedule.JobKey}")
                }; 

                ITrigger trigger = TriggerBuilder.Create()
                    .WithIdentity($"{jobSchedule.JobKey}.trigger")
                    .WithCronSchedule(jobSchedule.CronExpression)
                    .ForJob(jobDetail)
                    .Build();

                await scheduler.ScheduleJob(jobDetail, trigger);

            }
            Console.WriteLine("Hello Initialization is finished!");
            Console.WriteLine(jobSchedules.Count());

        }
    }
}
