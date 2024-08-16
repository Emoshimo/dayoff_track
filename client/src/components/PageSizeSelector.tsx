import React from 'react';

interface PageSizeSelectorProps {
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ pageSize, onPageSizeChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPageSizeChange(Number(e.target.value));
    };

    return (
        <div className="flex items-center">
            <label htmlFor="pageSize" className="flex items-center mb-2">Page Size:</label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={handleChange}
                className="border p-1 ml-2 mb-2"
            >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
        </div>
    );
};

export default PageSizeSelector;
