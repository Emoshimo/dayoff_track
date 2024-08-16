import React from 'react'
import { ButtonProps } from '../../interfaces/interfaces'

const CancelButton: React.FC<ButtonProps> = ({ a }) => {
    return (
        <button
            onClick={a}
            className="bg-rejected text-white px-4 py-2 rounded hover:bg-hoverReject"
        >
            Cancel
        </button>
    )
}

export default CancelButton