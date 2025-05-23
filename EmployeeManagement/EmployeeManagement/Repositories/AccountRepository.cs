﻿using EmployeeManagement.Data;
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

        public AccountRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<GeneralResponse> CreateEmployeeAsync(EmployeeDTO employeeDTO, DateOnly startDate)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(employeeDTO.Password);
            if (!DoPasswordsMatch(employeeDTO.Password, employeeDTO.ConfirmPassword)) 
            {
                return new GeneralResponse(false, "Passwords do not match.");
            }
            int nextUpdate = calculateNextDayOffUpdate(startDate);
            Employee newEmployee = new Employee()
            {
                EmailAddress = employeeDTO.EmailAddress,
                PasswordHashed = passwordHash,
                Name = employeeDTO.Name,
                Surname = employeeDTO.Surname,
                RemainingDayOffs = employeeDTO.DayOffNumber,
                StartDate = startDate,
                LastUpdatedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                NextDayOffUpdateAmount = nextUpdate
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

        private int calculateNextDayOffUpdate(DateOnly StartDate)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            int yearsWorked = today.Year - StartDate.Year;
            if (yearsWorked > 0 && yearsWorked < 6) 
            {
                return 14;
            }
            else if (yearsWorked < 15)
            {
                return 20;
            }
            else
            {
                return 26;
            }
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
                Environment.GetEnvironmentVariable("Jwt__Key") ?? throw new Exception("JWT_KEY could not be read")));

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
            var newDepartment = await _context.Departments.FindAsync(employee.DepartmentId);

            targetEmployee.Name = employee.Name;
            targetEmployee.Surname = employee.Surname;
            targetEmployee.SupervisorId = employee.SupervisorId;
            targetEmployee.DepartmentId = employee.DepartmentId;
            targetEmployee.StartDate = employee.StartDate;
            await _context.SaveChangesAsync();
            var outputEmployee = new ClientEmployee
            {
                Id = employee.Id,
                Name = employee.Name,
                Surname = employee.Surname,
                SupervisorId = employee.SupervisorId,
                DepartmentId = employee.DepartmentId,
                DepartmentName = newDepartment?.Name,
                StartDate = employee.StartDate,
            };

            return outputEmployee;
        }

    }
}
