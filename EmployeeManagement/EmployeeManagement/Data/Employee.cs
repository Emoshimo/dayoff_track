namespace EmployeeManagement.Data
{
    public class Employee
    {
        public int Id { get; set; }
        public int RemainingDayOffs { get; set; }
        public int? SupervisorId { get; set; }
        public int NextDayOffUpdateAmount { get; set; }
        public int? DepartmentId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PasswordHashed { get; set; }
        public bool IsActive { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly LastUpdatedDate { get; set; }
        public EmployeeRole EmployeeRole { get; set; }
        public Department? Department { get; set; }
        public ICollection<DayOffRequest> DayOffs { get; set; }

    }
}
