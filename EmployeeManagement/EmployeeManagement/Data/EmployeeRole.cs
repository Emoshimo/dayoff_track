using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Data
{
    public class EmployeeRole
    {

        [Key]
        public int EmployeeId { get; set; }
        [Key]
        public int RoleId { get; set; }
        public Role Role { get; set; }
    }
}
