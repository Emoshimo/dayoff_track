import React from 'react'
import { ItemButtonProps } from '../../interfaces/interfaces'



const EditButton: React.FC<ItemButtonProps> = ({ a, item }) => {
    return (
        <button
            onClick={() => a(item)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
        >
            Edit
        </button>)
}

export default EditButton