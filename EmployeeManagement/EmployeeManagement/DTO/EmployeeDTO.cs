using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.DTO
{
    public class EmployeeDTO
    {
        public int? Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Surname { get; set; } = string.Empty;
        [Required]
        public int DayOffNumber { get; set; }
        public int? ManagerId { get; set; }
        public int? DepartmentId { get; set; }

        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string EmailAddress { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = string.Empty;
        [Required]
        public string StartDate { get; set; }
    }
}
