import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
import ProfileAvatar from "../../assets/employee-engagement.png"; 


function HRProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

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
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar currentUser={currentUser} />
            <div className="sm:ml-64 p-6 pt-20 overflow-y-auto h-screen">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <img
                            src={currentUser.profilePicture || ProfileAvatar} 
                            alt="Profile"
                            className="h-40 w-40 rounded-full object-cover"
                        />
                    </div>
                    <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
                    <p className="text-gray-700 mb-2"><strong>Email:</strong> {currentUser.email}</p>
                    <p className="text-gray-700 mb-2"><strong>First Name:</strong> {currentUser.first_name || "-"}</p>
                    <p className="text-gray-700 mb-2"><strong>Last Name:</strong> {currentUser.last_name || "-"}</p>
                    <p className="text-gray-700 mb-4"><strong>Job Title:</strong> {currentUser.job_title || "-"}</p>
                </div>
            </div>
        </div>
    );
}

export default HRProfile;
