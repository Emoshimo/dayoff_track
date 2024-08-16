namespace EmployeeManagement.DTO
{
    public class ClientEmployee
    {
        public int Id { get; set; }
        public int? SupervisorId { get; set; }
        public int? DepartmentId { get; set; }
        public int CalculatedRemainingDayOff {  get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string? DepartmentName { get; set; }
        public DateOnly? StartDate { get; set; }
    }
}
