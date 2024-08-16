using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace EmployeeManagement.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<EmployeeRole > EmployeeRoles { get; set; }
        public DbSet<DayOffRequest> DayOffRequests { get; set; }
        public DbSet<DayOffType> DayOffTypes { get; set; }
        public DbSet<JobSchedule> JobSchedules { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            base.OnModelCreating(builder);
            builder.Entity<Department>()
                .HasIndex(d => d.ManagerId)
                .IsUnique();
            
            builder.Entity<Employee>()
                .HasOne(e => e.Department)
                .WithMany(d => d.Employees)
                .HasForeignKey(e => e.DepartmentId);

            builder.Entity<Department>()
                .HasOne(d => d.Manager)
                .WithMany() // No navigation property on Employee for the inverse relationship
                .HasForeignKey(d => d.ManagerId)
                .OnDelete(DeleteBehavior.Restrict); // Specify behavior on delete

            builder.Entity<Employee>()
                            .HasOne(e => e.Department)
                            .WithMany(d => d.Employees)
                            .HasForeignKey(e => e.DepartmentId)
                            .OnDelete(DeleteBehavior.Restrict); // Specify behavior on delete
        }

    }
}
