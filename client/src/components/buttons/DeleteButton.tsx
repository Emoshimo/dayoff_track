import React from 'react'
import { ItemButtonProps } from '../../interfaces/interfaces'

const DeleteButton: React.FC<ItemButtonProps> = ({ a, item }) => {
    return (
        <button
            onClick={() => a(item)}
            className="bg-rejected text-white hover:bg-hoverReject px-4 py-2 rounded"
        >
            Delete
        </button>
    )
}

export default DeleteButton