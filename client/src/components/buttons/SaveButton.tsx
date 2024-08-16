import { ButtonProps } from '../../interfaces/interfaces'
import React from 'react'


const SaveButton: React.FC<ButtonProps> = ({ a }) => {
    return (
        <button
            onClick={a}
            className="bg-approved text-white px-4 py-2 rounded hover:bg-hoverApprove"
        >
            Save
        </button>
    )
}

export default SaveButton