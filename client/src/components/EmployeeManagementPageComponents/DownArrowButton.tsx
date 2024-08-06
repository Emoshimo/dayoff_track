import React from 'react'
import { ArrowProps } from '../../interfaces/interfaces';
import { FaAngleDown } from 'react-icons/fa';


const DownArrowButton: React.FC<ArrowProps> = ({ currentKey, sortKey, sortOrder, handleSort }) => {
    const getIconColor = (key: string, order: string) => {
        return sortKey === key ? (sortOrder === order ? 'text-border' : 'text-gray-500') : 'text-gray-500';
    };
    return (
        <button onClick={() => handleSort(currentKey, "desc")}>
            <FaAngleDown className={getIconColor(currentKey, 'desc')} />
        </button>
    )
}

export default DownArrowButton