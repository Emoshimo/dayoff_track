using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Interfaces
{
    public interface IDayOffTypesRepository
    {
        Task<IEnumerable<DayOffType>> GetAll();
    }
}
