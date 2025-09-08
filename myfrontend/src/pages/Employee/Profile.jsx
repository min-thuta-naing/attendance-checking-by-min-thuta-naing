import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon,ClockIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import ProfileAvatar from "../../assets/user.png"; 
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmation from "../../components/LogoutConfirmation";

function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
    const navigate = useNavigate();
    const {showToast} = useToast(); 

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
                    {label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: () => setShowLogoutConfirm(true)},
                ]}
            />

            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <img
                        src={ProfileAvatar}
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
                    onClick={() => setShowLogoutConfirm(true)}
                    className="mt-6 w-full py-3 btn-warning rounded-lg font-semibold transition"
                >
                    Log Out
                </button>
            </div>

            <LogoutConfirmation
                isOpen={showLogoutConfirm}
                title="Confirm to Logout"
                message="Are you sure you want to log out?"
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />

        </div>
    );
}

export default Profile;
