import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import Loading from "../../components/Loading";
import PasswordInputComponent from "../../components/PasswordInputComponent";

function ChangePasswordPage() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const {showToast} = useToast(); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) navigate("/login"); 
        setCurrentUser(user);
    }, []);

    if (!currentUser) return <Loading redirectButtonNav="/login" />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const refreshAccessToken = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("currentUser"));
            const res = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: user.refresh,
            });
            const updatedUser = { ...user, access: res.data.access };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            return res.data.access;
        } catch (err) {
            console.error("Token refresh failed:", err);
            navigate("/login");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = currentUser.access;

        try {
            const res = await axios.post(
                "http://localhost:8000/api/change-password/",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            showToast(res.data.message || "Password changed successfully", "success");
            setFormData({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
            
            localStorage.removeItem("currentUser");
            setCurrentUser(null);

            navigate("/login");
        } catch (err) {
            if (err.response?.status === 401) {
                token = await refreshAccessToken();
                if (!token) return;
                return handleSubmit(e);
            }
            showToast(err.response?.data?.error || "Failed to change password", "error");
        }
    };

    return (
        <div className="min-h-screen flex random-gradient-bg2">
            <div className="flex-1 pt-20 p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center mb-9">
                    <h1 className="font-semibold text-lg">Your account information </h1>
                    <p>Your email address: <strong>{currentUser.email}</strong></p>
                    <p>Your full name: <strong>{currentUser.first_name} {currentUser.last_name}</strong></p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
                    <h2 className="text-xl font-bold mb-6">Change Password</h2>
                    {message && <p className="text-sm text-red-500 mb-4">{message}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">

                        <PasswordInputComponent
                            value={formData.current_password}
                            onChange={handleChange}
                            name="current_password"
                            label="Current Password"
                        />

                        <PasswordInputComponent
                            value={formData.new_password}
                            onChange={handleChange}
                            name="new_password"
                            label="New Password"
                        />

                        <PasswordInputComponent
                            value={formData.confirm_password}
                            onChange={handleChange}
                            name="confirm_password"
                            label="Confirm Password"
                        />

                        <button
                            type="submit"
                            className="btn-primary w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPage;