import React from 'react'

interface DynamicTableHeaderProsp {
    fields: string[]
}

const DynamicTableHeader: React.FC<DynamicTableHeaderProsp> = ({ fields }) => {
    return (
        <thead>
            <tr className='bg-primary text-slate-200'>
                {fields.map(field => (
                    <th key={field} className='border border-gray-300 px-4 py-2'>
                        {field}
                    </th>
                ))}
            </tr>
        </thead>
    )

}
export default DynamicTableHeader