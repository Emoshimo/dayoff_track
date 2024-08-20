import React, { useState } from 'react'
import PopUp from '../components/PopUp'
import { useGetDepartmentEmployees } from '../hooks/useGetDepartmentEmployees';
import useEmployeeStore from '../stores/employeeStore';
import { ClientEmployee } from '../interfaces/interfaces';
import PageSizeSelector from '../components/PageSizeSelector';
import Pagination from '../components/Pagination';

const DepartmentManagerPage = () => {
    const [popupMessage, setPopupMessage] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const { clientEmployee } = useEmployeeStore();
    const token = localStorage.getItem("token");
    const showError = (message: string) => {
        setPopupMessage(message);
    };
    const handleClosePopup = () => {
        setPopupMessage(null);
    };
    const { employees, loading, totalPages } = useGetDepartmentEmployees(
        token!,
        clientEmployee?.id!,
        pageSize,
        pageNumber,
        showError
    );
    console.log(employees);
    return (
        <div>
            <div className='overflow-x-auto'>
                <PageSizeSelector pageSize={pageSize} onPageSizeChange={setPageSize} />
                <table className="table-auto min-w-full bg-white border-collapse border shadow-custom-black">
                    <thead>
                        <tr>
                            <th key={"Id"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                                {`Id `}
                            </th>
                            <th key={"Name"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                                {`Name `}

                            </th>
                            <th key={"Surname"} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                                {`Surname `}

                            </th>
                            <th key={""} className='border border-gray-300 px-4 py-2 bg-primary text-slate-200'>
                                {`Remaining Day Offs `}

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees && !loading &&
                            employees.map((item: ClientEmployee, index: number) => (
                                <tr
                                    key={item.id}
                                    className={`text-center ${index % 2 === 0 ? "" : "bg-slate-100"
                                        }`}>
                                    <td className="border border-gray-300 px-4 py-2 w-12">
                                        {item.id}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 w-12">
                                        {item.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 w-12">
                                        {item.surname}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 w-12">
                                        {item.calculatedRemainingDayOff}
                                    </td>

                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {pageNumber > 1 && <Pagination pageNumber={pageNumber} totalPages={totalPages} setPageNumber={setPageNumber} />}

            </div>
            <div>
                {
                    popupMessage && (
                        <PopUp message={popupMessage} onClose={handleClosePopup} />
                    )
                }
                {loading && (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}

export default DepartmentManagerPage