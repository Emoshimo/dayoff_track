import React from 'react'

interface DynamicSearchInputProps {
    id: string,
    name: string,
    placeHolder: string,
    onChange: (event: any, name: string) => void
}

const DynamicSearchInput: React.FC<DynamicSearchInputProps> = ({ id, name, placeHolder, onChange }) => {
    return (
        <div>
            <input
                id={id}
                name={name}
                className="text-slate-200 text-center bg-primary border-2 border-border rounded-md focus:outline-none"
                type="text"
                placeholder={placeHolder}
                onChange={(e) => onChange(e.target.value, name)}
            />
        </div>
    )
}

export default DynamicSearchInput