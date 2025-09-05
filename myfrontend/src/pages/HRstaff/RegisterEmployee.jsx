import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import FirstNameInputComponent from "../../components/FirstNameInputComponent";
import LastNameInputComponent from "../../components/LastNameInputComponent";
import JobTitleInputComponent from "../../components/JobTitleInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";
import PasswordInputComponent from "../../components/PasswordInputComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterEmployee() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        email: "",
        role: "EMPLOYEE", // default
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Load current HR user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;
        setCurrentUser(user);
    }, []);

    if (!currentUser) {
        return <Loading redirectButtonNav="/hrlogin" />;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Refresh access token if expired
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
            console.error("Refresh token failed:", err);
            navigate("/hrlogin"); // redirect HR to login
        }
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

            alert("Employee registered successfully!");
            setFormData({
                // first_name: "",
                // last_name: "",
                // job_title: "",
                // email: "",
                // password: "",
                // confirmPassword: "",
                first_name: "",
                last_name: "",
                job_title: "",
                email: "",
                role: "EMPLOYEE", // default
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
                    alert("Employee registered successfully!");
                    setFormData({
                        // first_name: "",
                        // last_name: "",
                        // job_title: "",
                        // email: "",
                        // password: "",
                        // confirmPassword: "",
                        first_name: "",
                        last_name: "",
                        job_title: "",
                        email: "",
                        role: "EMPLOYEE", // default
                    });
                } catch (innerErr) {
                    console.error(innerErr);
                    alert(innerErr.response?.data?.error || "Registration failed");
                }
            } else {
                console.error(err);
                alert(err.response?.data?.error || "Registration failed");
            }
        }
    };



    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar currentUser={currentUser} />
            <div className="flex-1 pt-16 p-6">
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
                        {/* <PasswordInputComponent
                            value={formData.password}
                            onChange={handleChange}
                            name="password"
                        />
                        <PasswordInputComponent
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            name="confirmPassword"
                        /> */}

                        <div className="text-sm text-gray-700 mb-4">
                            The default password is <strong>Default@123</strong>. Please inform the employee to change it later.
                        </div>

                        <label className="block mb-2 font-medium">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                        >
                            <option value="EMPLOYEE">Employee</option>
                            <option value="HR">HR staff</option>
                        </select>


                        <button
                            type="submit"
                            className="btn-primary w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Register Employee
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterEmployee;
