import React from 'react'

interface DeletePopUpProps {
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeletePopUp: React.FC<DeletePopUpProps> = ({ message, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-start z-50">
            <div className="mt-16 bg-white p-5 rounded-lg shadow-lg text-center text-primary">
                <p className="mb-4">{message}</p>
                <div>
                    <button
                        className="bg-rejected hover:bg-hoverReject text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-approved hover:bg-hoverApprove text-white font-bold py-2 px-4 rounded"
                        onClick={onClose}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}


export default DeletePopUp