namespace EmployeeManagement.Data
{
    public class EmployeeDepartment
    {
        public int Id { get; set; }
        public int DepartmentId { get; set; }
        public string EmployeeId { get; set; }
        public DateTime JoinDate { get; set; }
        public Employee Employee { get; set; }
        public Department Department { get; set; }
    }
}
