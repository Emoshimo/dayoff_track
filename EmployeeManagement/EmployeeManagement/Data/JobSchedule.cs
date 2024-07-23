namespace EmployeeManagement.Data
{
    public class JobSchedule
    {
        public int Id { get; set; }
        public string JobKey { get; set; }
        public string Group {  get; set; }
        public string CronExpression { get; set; }
        public bool IsActive { get; set; }
    }
}
