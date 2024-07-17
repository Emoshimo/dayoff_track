export const getTitleBackgroundColor = (title: string) => {
  switch (title) {
    case "Pending":
      return "bg-pending";
    case "Approved":
      return "bg-approved";
    case "Rejected":
      return "bg-rejected";
    default:
      return "bg-second";
  }
};
