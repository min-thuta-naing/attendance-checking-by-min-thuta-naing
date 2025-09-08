import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon,ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import ProfileAvatar from "../../assets/user.png"; 
import { useToast } from "../../contexts/ToastContext";

function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const {showToast} = useToast(); 

    // Load user from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        showToast("You have logged out successfully", "success");
        navigate("/login");
    };

    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen pt-20 random-gradient-bg flex flex-col items-center justify-center p-6">
            <Header
                backNavigation
                title="Profile"
                menuItems={[
                    {label: "Go to Home", icon: <HomeIcon className="h-6 w-6" />, onClick: () => navigate("/home")},
                    {label: "Attendance History", icon: <ClockIcon className="h-6 w-6" />, onClick: () => navigate("/emp-attendance-history")},
                    {label: "Change Password", icon: <PencilIcon className="h-6 w-6" />, onClick: () => navigate("/change-password")},
                    {label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: () => handleLogout()},
                ]}
            />

            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                {/* Profile Photo */}
                <div className="flex justify-center mb-6">
                    <img
                        src={currentUser.profilePicture || ProfileAvatar} // use default if none
                        alt="Profile"
                        className="h-40 w-40 rounded-full object-cover"
                    />
                </div>

                <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Profile</h1>

                <div className="text-left space-y-3">
                    <p className="text-gray-700">
                        <span className="font-semibold">First Name:</span> {currentUser.first_name || "-"}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Last Name:</span> {currentUser.last_name || "-"}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {currentUser.email}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Job Title:</span>{" "}
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                            {currentUser.job_title || "-"}
                        </span>
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-6 w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                >
                    Log Out
                </button>
            </div>



        </div>
    );
}

export default Profile;
