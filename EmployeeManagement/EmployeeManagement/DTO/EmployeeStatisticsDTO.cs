namespace EmployeeManagement.DTO
{
    public class EmployeeStatisticsDTO
    {
        public int ApprovedCount { get; set; }
        public int RejectedCount { get; set; }
        public int PendingCount { get; set; }
        public int CanceledCount { get; set; }
    }
}
