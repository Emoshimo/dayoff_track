import React from 'react'
import PaginationButton from './buttons/PaginationButton';

interface PaginationProps {
    pageNumber: number;
    totalPages: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}
const Pagination: React.FC<PaginationProps> = ({ pageNumber, totalPages, setPageNumber }) => {
    return (
        <div className="m-4 flex items-center justify-center">
            <PaginationButton
                onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                disabled={pageNumber === 1}
                label="Previous"
                isActive={pageNumber === 1}
            />
            <span className="mx-2">Page {pageNumber} of {totalPages}</span>
            <PaginationButton
                onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages))}
                disabled={pageNumber === totalPages}
                label="Next"
                isActive={pageNumber === totalPages}
            />
        </div>
    )
}

export default Pagination