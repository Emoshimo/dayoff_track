using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeManagement.Data
{
  
    public class DayOffRequest
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int? PendingManagerId { get; set; }
        public int DayOffTypeId { get; set; }
        public string Status { get; set; } 
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }

    }


}
