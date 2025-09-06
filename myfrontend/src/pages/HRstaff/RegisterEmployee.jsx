import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import FirstNameInputComponent from "../../components/FirstNameInputComponent";
import LastNameInputComponent from "../../components/LastNameInputComponent";
import JobTitleInputComponent from "../../components/JobTitleInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";
import RoleSelectComponent from "../../components/RoleSelectComponent";
import ToastNotification from "../../components/ToastNotification";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterEmployee() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        email: "",
        role: "EMPLOYEE", 
    });
    const [message, setMessage] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();

    // Load current HR user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;
        setCurrentUser(user);
    }, []);

    // to refresh a new access token when it is expired 
    const refreshAccessToken = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser.refresh) return null; 

        try {
            // const user = JSON.parse(localStorage.getItem("currentUser"));
            const res = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: currentUser.refresh,
            });
            const updatedUser = { ...currentUser, access: res.data.access };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            return res.data.access;
        } catch (err) {
            console.error("Failed to refresh token:", err);
            localStorage.removeItem("currentUser");
            navigate("/hrlogin");
            return null; 
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            job_title: formData.job_title,
            role: formData.role,
        };

        let token = currentUser.access;

        try {
            await axios.post(
                "http://localhost:8000/api/employees/register/",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPopupMessage({ message: "Employee registered successfully!", type: "success" });
            setFormData({
                first_name: "",
                last_name: "",
                job_title: "",
                email: "",
                role: "EMPLOYEE", 
            });

        } catch (err) {
            // If 401, try refreshing token
            if (err.response?.status === 401) {
                token = await refreshAccessToken();
                if (!token) return; // failed to refresh
                try {
                    await axios.post(
                        "http://localhost:8000/api/employees/register/",
                        payload,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log("Token:", currentUser.access);
                    setPopupMessage({ message: "Employee registered successfully!", type: "success" });
                    setFormData({
                        first_name: "",
                        last_name: "",
                        job_title: "",
                        email: "",
                        role: "EMPLOYEE", 
                    });
                } catch (innerErr) {
                    console.error(innerErr);
                    setPopupMessage({ message: "Failed to register employee. Try again!", type: "error" });
                }
            } else {
                console.error(err);
                setPopupMessage({ message: "Failed to register employee. Try again!", type: "error" });
            }
        }
    };

    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar currentUser={currentUser} />
            <div className="flex-1 pt-16 p-6 relative">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
                    <h2 className="text-xl font-bold mb-6">Register New Employee</h2>

                    {message && <p className="text-sm mb-4 text-red-500">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <FirstNameInputComponent
                            value={formData.first_name}
                            onChange={handleChange}
                            name="first_name"
                        />
                        <LastNameInputComponent
                            value={formData.last_name}
                            onChange={handleChange}
                            name="last_name"
                        />
                        <JobTitleInputComponent
                            value={formData.job_title}
                            onChange={handleChange}
                            name="job_title"
                        />
                        <EmailInputComponent
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                        />

                        <RoleSelectComponent
                            value={formData.role}
                            onChange={handleChange}
                            name="role"
                        />

                        <div className="text-sm text-gray-700 mb-4">
                            The default password is <strong>Default@123</strong>. Please inform the employee to change it later.
                        </div>


                        <button
                            type="submit"
                            className="btn-primary w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Register Employee
                        </button>
                    </form>
                </div>

                {popupMessage && (
                    <ToastNotification
                        message={popupMessage.message}
                        type={popupMessage.type}
                        onClose={() => setPopupMessage("")}
                    />
                )}

            </div>
        </div>
    );
}

export default RegisterEmployee;
