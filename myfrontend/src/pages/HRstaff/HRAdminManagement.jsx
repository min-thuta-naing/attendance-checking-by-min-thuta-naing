import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";

function HRAdminManagement() {
    const [currentUser, setCurrentUser] = useState(null);
    const [hrstaff, setHRStaff] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        // only HR with access can see the employee list 
        if (user?.role === "HR" && user?.access) {  
            fetchHRstaff(user.access);
        }
    }, []);


    const fetchHRstaff = async (token) => {
        try {
            const res = await axios.get("http://localhost:8000/api/hr-staff-all/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setHRStaff(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                // refresh if access token is expired 
                const newToken = await refreshAccessToken();
                if (newToken) fetchHRstaff(newToken); // fetch employee lists again with new token 
            } else {
                console.error("Failed to fetch HR staff:", err);
            }
        }
    };

    // to refresh a new access token when it is expired 
    const refreshAccessToken = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser?.refresh) return null;

        try {
            const res = await axios.post("http://localhost:8000/api/token/refresh/", {
                refresh: currentUser.refresh
            });
            const updatedUser = { ...currentUser, access: res.data.access };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser); // update state
            return res.data.access;
        } catch (err) {
            console.error("Failed to refresh token:", err);
            // token refresh failed → force logout
            localStorage.removeItem("currentUser");
            navigate("/hrlogin");
            return null;
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar currentUser={currentUser} />
            <div className="flex-1 pt-20 p-6">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4 text-center">HR Admin Accounts</h1>
                    <p className="text-base mb-4 text-start">
                        The following is the list of all registered HR admin accounts.<br />
                        Please contact <strong>IT team</strong> to update the name or job title.
                    </p>


                    <table className="w-full table-auto border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border px-4 py-2">Email</th>
                                <th className="border px-4 py-2">First Name</th>
                                <th className="border px-4 py-2">Last Name</th>
                                <th className="border px-4 py-2">Job Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hrstaff.map(hr => (
                                <tr key={hr.id}>
                                    <td className="border px-4 py-2">{hr.email}</td>
                                    <td className="border px-4 py-2">{hr.first_name}</td>
                                    <td className="border px-4 py-2">{hr.last_name}</td>
                                    <td className="border px-4 py-2">{hr.job_title}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default HRAdminManagement;
