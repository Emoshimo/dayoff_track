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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            
            base.OnModelCreating(builder);
            
            builder.Entity<EmployeeRole>()
                .HasKey(er => new { er.EmployeeId, er.RoleId });
        }

    }
}
