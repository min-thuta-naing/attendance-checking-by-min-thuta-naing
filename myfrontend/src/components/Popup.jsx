import React from "react";

function Popup({ message, onClose, className }) {
    return (
        <div className={className}>
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h3 className="text-lg font-semibold mb-4">Notification</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

export default Popup;
