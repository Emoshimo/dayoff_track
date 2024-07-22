using EmployeeManagement.DTO;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Interfaces
{
    public interface IAccountRepository
    {
        Task<GeneralResponse> CreateEmployeeAsync(EmployeeDTO employeeDTO, DateOnly startDate);
        Task<LoginResponse> Login(LoginDTO loginDTO);
        Task<ClientEmployee> EditEmployee(ClientEmployee employee);
    }
}
