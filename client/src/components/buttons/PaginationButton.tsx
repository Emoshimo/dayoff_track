import React from 'react'
import { PaginationButtonProps } from '../../interfaces/interfaces'

const PaginationButton: React.FC<PaginationButtonProps> = ({ onClick, disabled, label, isActive }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`text-slate-200 px-3 py-1 rounded ${isActive ? 'bg-gray-400' : 'bg-primary'} ${disabled ? 'cursor-not-allowed' : 'hover:bg-hover'}`}
        >
            {label}
        </button>
    )
}

export default PaginationButton