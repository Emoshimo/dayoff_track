namespace EmployeeManagement.Data
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ManagerId { get; set; }
        public Employee? Manager { get; set; }
    }
}
