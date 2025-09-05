import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";

function HRDashboard() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate(); 

    // Load user from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/hrlogin");
    };

    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/hrlogin" />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar currentUser={currentUser} />
            <div className="flex-1 pt-20 p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to HR dashboard!</h1>
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> {currentUser.email}</p>
                    <p className="text-gray-700 mb-2"><strong>First Name:</strong> {currentUser.first_name || "-"}</p>
                    <p className="text-gray-700 mb-2"><strong>Last Name:</strong> {currentUser.last_name || "-"}</p>
                    <p className="text-gray-700 mb-4"><strong>Job Title:</strong> {currentUser.job_title || "-"}</p>
                </div>
            </div>
        </div>
    );
}

export default HRDashboard;
