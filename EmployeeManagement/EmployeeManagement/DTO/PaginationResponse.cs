namespace EmployeeManagement.DTO
{
    public class PaginationResponse
    {
        public IEnumerable<ClientEmployee> employees { get; set; }
        public int totalPageNumber { get; set; }
    }
}
