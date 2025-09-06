import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Load user from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        window.location.href = "/login"; // redirect to login page
    };

    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-100 flex flex-col items-center justify-center p-6">
            <Header
                backNavigation
                title="Profile"
                menuItems={[
                    { label: "Go to Home", icon: <HomeIcon className="h-6 w-6" />, onClick: () => navigate("/home") },
                    { label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: () => alert("Logging out") },
                ]}
            />
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Profile!</h1>
                <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {currentUser.email}
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>First Name:</strong> {currentUser.first_name || "-"}
                </p>
                <p className="text-gray-700 mb-2">
                    <strong>Last Name:</strong> {currentUser.last_name || "-"}
                </p>
                <p className="text-gray-700 mb-4">
                    <strong>Job Title:</strong> {currentUser.job_title || "-"}
                </p>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

export default Profile;
