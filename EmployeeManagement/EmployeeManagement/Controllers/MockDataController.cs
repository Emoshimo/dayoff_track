using EmployeeManagement.Data;
using EmployeeManagement.DTO;
using EmployeeManagement.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    public class MockDataController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IAccountRepository _accountRepository;

        public MockDataController(AppDbContext context, IAccountRepository accountRepository)
        {
            _context = context;
            _accountRepository = accountRepository;
        }

        [HttpPost("generate-employees")]
        public async Task<IActionResult> GenerateEmployees()
        {
            await CreateMockDataAsync(1000, 100);
            return Ok();
        }

        private async Task GenerateAndInsertBatchAsync(int batchSize, int startId)
        {
            var employees = new List<EmployeeDTO>();
            for (int i = 0; i < batchSize; i++)
            {
                employees.Add(new EmployeeDTO
                {
                    Name = GenerateRandomString(8),
                    Surname = GenerateRandomString(8),
                    DayOffNumber = new Random().Next(5, 21), // Random number between 5 and 20
                    EmailAddress = $"{GenerateRandomString(5)}@example.com",
                    Password = "P@ssw0rd", // You may want to generate different passwords for each user
                    ConfirmPassword = "P@ssw0rd",
                    StartDate = GenerateRandomStartDate().ToString("yyyy-MM-dd")
                });
            }

            foreach (var employee in employees)
            {
                var result = await _accountRepository.CreateEmployeeAsync(employee, DateOnly.Parse(employee.StartDate));
                if (!result.flag)
                {
                    Console.WriteLine($"Failed to create employee with email {employee.EmailAddress}: {result.Message}");
                }
            }
        }

        public async Task CreateMockDataAsync(int totalEntries, int batchSize)
        {
            int batches = totalEntries / batchSize;
            for (int i = 0; i < batches; i++)
            {
                int batchStart = i * batchSize;
                await GenerateAndInsertBatchAsync(batchSize, batchStart);
            }
        }

        private DateOnly GenerateRandomStartDate()
        {
            var random = new Random();
            int year = random.Next(2018, 2024);
            int month = random.Next(1, 13);
            int day = random.Next(1, DateTime.DaysInMonth(year, month) + 1);
            return new DateOnly(year, month, day);
        }

        private string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var random = new Random();
            char[] stringChars = new char[length];

            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            return new string(stringChars);
        }
    }
}
