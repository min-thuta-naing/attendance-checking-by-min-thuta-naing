import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { HomeIcon, ArrowRightOnRectangleIcon, PencilIcon, UserIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import PasswordInputComponent from "../../components/PasswordInputComponent";

function EmployeeChangePasswordPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);
    }, []);

    if (!currentUser) return <Loading redirectButtonNav="/home" />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = currentUser.access;

        try {
            const res = await fetch("http://localhost:8000/api/employee/change-password/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to change password");
            alert(data.message);
            setFormData({ current_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full flex flex-col items-center pt-28 p-6">
            <Header
                backNavigation
                title="Change Password"
                menuItems={[
                    { label: "Go to Home", icon: <HomeIcon className="h-6 w-6" />, onClick: () => navigate("/home") },
                    { label: "Profile", icon: <UserIcon className="h-6 w-6" />, onClick: () => navigate("/profile") },
                    { label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: handleLogout },
                ]}
            />

            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mt-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>

                {message && <p className="text-red-500 text-sm mb-4">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <PasswordInputComponent
                        name="current_password"
                        label="Current Password"
                        value={formData.current_password}
                        onChange={handleChange}
                    />
                    <PasswordInputComponent
                        name="new_password"
                        label="New Password"
                        value={formData.new_password}
                        onChange={handleChange}
                    />
                    <PasswordInputComponent
                        name="confirm_password"
                        label="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EmployeeChangePasswordPage;
