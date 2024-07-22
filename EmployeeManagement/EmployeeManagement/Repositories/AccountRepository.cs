using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static EmployeeManagement.DTO.ServiceResponses;

namespace EmployeeManagement.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountRepository(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<GeneralResponse> CreateEmployeeAsync(EmployeeDTO employeeDTO, DateOnly startDate)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(employeeDTO.Password);
            if (!DoPasswordsMatch(employeeDTO.Password, employeeDTO.ConfirmPassword)) 
            {
                return new GeneralResponse(false, "Passwords do not match.");
            }

            Employee newEmployee = new Employee()
            {
                EmailAddress = employeeDTO.EmailAddress,
                PasswordHashed = passwordHash,
                Name = employeeDTO.Name,
                Surname = employeeDTO.Surname,
                RemainingDayOffs = employeeDTO.DayOffNumber,
                StartDate = startDate
            };

            await _context.Employees.AddAsync(newEmployee);
            await _context.SaveChangesAsync();

            Role defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (defaultRole != null)
            {
                // Assign the found role to the new employee
                _context.EmployeeRoles.Add(new EmployeeRole
                {
                    EmployeeId = newEmployee.Id,
                    RoleId = defaultRole.RoleId
                });
            }
            else
            {
                return new GeneralResponse(false, "Default role 'User' not found.");
            }
            await _context.SaveChangesAsync();


            return new GeneralResponse(true, "User created");
        }
        private bool DoPasswordsMatch(string p1, string p2)
        {
            return p1 == p2;
        }

        public async Task<LoginResponse> Login(LoginDTO loginDTO)
        {
            var employee = await _context.Employees
                .SingleOrDefaultAsync(e => e.EmailAddress == loginDTO.EmailAddress);

            if (employee == null) 
            {
                return new LoginResponse(false, "Invalid email or password.", "", null);
            }
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDTO.Password, employee.PasswordHashed);
            if (!isPasswordValid)
            {
                return new LoginResponse(false, "Invalid email or password.", "", null);
            }
            var token = await  CreateToken(employee);
            return new LoginResponse(true, "Login successful.", token, employee.Id);
        }

        private async Task<string> CreateToken(Employee employee)
        {
            var employeeRoles = await _context.EmployeeRoles
                .Where(er => er.EmployeeId == employee.Id)
                .Include(er => er.Role)
                .ToListAsync();

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,employee.EmailAddress ),
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
            };
            claims.AddRange(employeeRoles.Select(er => new Claim(ClaimTypes.Role, er.Role.RoleName)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("JWT:Key").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires : DateTime.Now.AddMinutes(60),
                signingCredentials : cred);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public async Task<ClientEmployee> EditEmployee(ClientEmployee employee)
        {
            var targetEmployee = await _context.Employees.FindAsync(employee.Id);
            if (targetEmployee == null)
            {
                throw new InvalidDataException("Employee not found");
            }

            targetEmployee.Name = employee.Name;
            targetEmployee.Surname = employee.Surname;
            targetEmployee.RemainingDayOffs = employee.RemainingDayOffs;
            targetEmployee.ManagerId = employee.ManagerId;
            await _context.SaveChangesAsync();
            var outputEmployee = new ClientEmployee
            {
                Id = employee.Id,
                Name = employee.Name,
                Surname = employee.Surname,
                RemainingDayOffs = employee.RemainingDayOffs,
                ManagerId = employee.ManagerId,
            };

            return outputEmployee;
        }

    }
}
