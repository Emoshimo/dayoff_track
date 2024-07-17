/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#002A56",
        second: "#3481d1",
        hover: "#06111c",
        pending: "#F29339",
        approved: "#077E8C",
        hoverApprove: "#05a3b5",
        rejected: "#D9512C",
        hoverReject: "#ff0800",
      },
    },
  },
  plugins: [],
};
