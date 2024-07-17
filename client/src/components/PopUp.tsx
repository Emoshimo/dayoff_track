import React, { useEffect } from 'react'

interface PopupProps {
    message: string;
    onClose: () => void;
}

const PopUp = ({message, onClose } : PopupProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);
    return (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-start z-50">
            <div className="mt-16 bg-white p-5 rounded-lg shadow-lg text-center text-primary">
                <p className="mb-4">{message}</p>
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default PopUp