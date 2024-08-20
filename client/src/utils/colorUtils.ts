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
export const getRandomColor = () => {
    const letters = '013456789ABCDF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 14)];
    }
    return color;
};

