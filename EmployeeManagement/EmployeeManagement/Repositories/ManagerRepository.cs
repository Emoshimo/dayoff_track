using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using EmployeeManagement.Services.EmployeeCacheService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class ManagerRepository : IManagerRepository
    {
        private readonly AppDbContext _context;
        private readonly IEmployeeCache _employeeCache;

        public ManagerRepository(AppDbContext context, IEmployeeCache employeeCache)
        {
            _context = context;
            _employeeCache = employeeCache;
        }

    }
}