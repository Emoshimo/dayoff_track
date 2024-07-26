namespace EmployeeManagement.Data
{
    public class EmployeeDayOffs
    {
        public int EmployeeId {  get; set; }
        public int RemainingDayOffs { get; set; }
        public DateOnly LastUpdatedDate { get; set; }
        public DateOnly StartDate { get; set; }
        public int NextUpdateAmount { get; set; }

    }
}
