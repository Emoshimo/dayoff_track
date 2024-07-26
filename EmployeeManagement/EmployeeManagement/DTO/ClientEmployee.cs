namespace EmployeeManagement.DTO
{
    public class ClientEmployee
    {
        public int Id { get; set; }
        public int RemainingDayOffs { get; set; }
        public int? ManagerId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateOnly? StartDate { get; set; }
    }
}
