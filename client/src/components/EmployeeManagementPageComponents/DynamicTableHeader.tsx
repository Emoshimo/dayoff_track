import React from 'react'
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

interface DynamicTableHeaderProps {
    fields: string[]
}

const DynamicTableHeader: React.FC<DynamicTableHeaderProps> = ({ fields }) => {
    return (
        <thead>
            <tr className='bg-primary text-slate-200'>
                {fields.map(field => (
                    <th key={field} className='border border-gray-300 px-4 py-2 '>
                        {`${field} `}
                        <div className='flex flex-col'>
                            <button><FaAngleUp /></button>
                            <button><FaAngleDown /></button>
                        </div>

                    </th>

                ))}
            </tr>
        </thead>
    )

}
export default DynamicTableHeader