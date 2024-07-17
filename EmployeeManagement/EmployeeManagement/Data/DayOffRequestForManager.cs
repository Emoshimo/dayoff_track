namespace EmployeeManagement.Data
{
    public class DayOffRequestForManager
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeSurname { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }


    }
}
