import React from "react";
import { ClientEmployee } from "../../interfaces/interfaces";

const EmployeeListItem = ({ employee }: { employee: ClientEmployee }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full sm:w-4/5 lg:w-3/5 xl:w-full mx-auto my-8">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {employee.name} {employee.surname}
        </div>

        <p className="text-gray-700 text-base">
          Remaining Day Offs: {employee.remainingDayOffs}
        </p>
      </div>
    </div>
  );
};

export default EmployeeListItem;
