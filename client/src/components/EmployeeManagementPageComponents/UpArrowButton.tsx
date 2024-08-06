import React from 'react'
import { FaAngleUp } from 'react-icons/fa'
import { ArrowProps } from '../../interfaces/interfaces';


const UpArrowButton: React.FC<ArrowProps> = ({ currentKey, sortKey, sortOrder, handleSort }) => {
    const getIconColor = (key: string, order: string) => {
        return sortKey === key ? (sortOrder === order ? 'text-border' : 'text-gray-500') : 'text-gray-500';
    };
    return (
        <button onClick={() => handleSort(currentKey, "asc")}>
            <FaAngleUp className={getIconColor(currentKey, 'asc')} />
        </button>
    )
}

export default UpArrowButton