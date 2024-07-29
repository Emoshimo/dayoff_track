namespace EmployeeManagement.Utils
{
    public static class DateUtils
    {
        public static int GetWorkingDays(DateOnly startDate, DateOnly endDate)
        {
            // Implement the logic to calculate working days between two dates
            // Example: Calculate the number of business days between two dates
            var totalDays = (endDate.ToDateTime(new TimeOnly()) - startDate.ToDateTime(new TimeOnly())).Days + 1;
            int workingDays = 0;

            for (var i = 0; i < totalDays; i++)
            {
                var currentDate = startDate.ToDateTime(new TimeOnly()).AddDays(i);
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    workingDays++;
                }
            }

            return workingDays;
        }
    }
}
