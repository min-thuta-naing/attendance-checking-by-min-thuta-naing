import SuccessIcon from "../assets/check.png";
import ErrorIcon from "../assets/close.png";
import InfoIcon from "../assets/info.png";
import React, { useEffect } from "react";

function ToastNotification({ message, type = "success", duration = 3000, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        if (type === "success") return SuccessIcon;
        if (type === "error") return ErrorIcon;
        return InfoIcon; 
    };

    const bgColor = type === "success" ? "bg-[#C9E9D2]" : type === "error" ? "bg-[#FFAAA6]" : "bg-[#9EC6F3]";

    return (
        <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-black px-6 py-2 rounded shadow-lg text-sm flex items-center gap-2 z-50`}
        >
            <span>{message}</span>
            <img src={getIcon()} alt={type} className="w-4 h-4" />
        </div>

    );
}

export default ToastNotification;
