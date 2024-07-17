using System.ComponentModel;

namespace EmployeeManagement.DTO
{
    public class AssignManagerRequest
    {
        public string EmployeeId { get; set; }
        public int DepartmentId { get; set; }
    }
}
