import React from 'react'

interface DynamicSearchInputProps {
    id: string,
    name: string,
    placeHolder?: string,
    onChange: (event: any, name: string) => void
}

const DynamicSearchInput: React.FC<DynamicSearchInputProps> = ({ id, name, placeHolder, onChange }) => {
    const years = Array.from({ length: 2024 - 2018 + 1 }, (_, i) => 2018 + i);

    return (
        <div>
            {name === "StartDate" ? (
                <select
                    id={id}
                    name={name}
                    className="text-slate-200 text-center bg-primary border-2 w-48 border-border rounded-md focus:outline-none"
                    onChange={(e) => onChange(e.target.value, name)}
                >
                    <option value="">Select Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    name={name}
                    className="text-slate-200 text-center bg-primary border-2 border-border rounded-md focus:outline-none"
                    type="text"
                    placeholder={placeHolder}
                    onChange={(e) => onChange(e.target.value, name)}
                />
            )}
        </div>
    )
}

export default DynamicSearchInput