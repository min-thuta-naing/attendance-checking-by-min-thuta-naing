import React from "react";

function LogoutConfirmation({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
            <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">{title}</h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 btn-warning rounded transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutConfirmation;
