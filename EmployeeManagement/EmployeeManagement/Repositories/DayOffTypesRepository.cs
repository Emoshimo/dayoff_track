using EmployeeManagement.Data;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Repositories
{
    public class DayOffTypesRepository : IDayOffTypesRepository
    {
        private readonly AppDbContext _context;
        public DayOffTypesRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DayOffType>> GetAll()
        {
            return await _context.DayOffTypes.ToListAsync();
        }
    }
}
