namespace EmployeeManagement.Data
{
    public class Employee
    {
        public int Id { get; set; }
        public int RemainingDayOffs { get; set; }
        public int? ManagerId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string EmailAddress { get; set; }
        public string PasswordHashed { get; set; }
    }
}