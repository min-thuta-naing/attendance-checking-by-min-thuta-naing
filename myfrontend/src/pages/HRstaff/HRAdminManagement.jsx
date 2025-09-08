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
                const newToken = await refreshAccessToken();
                if (newToken) fetchHRstaff(newToken); 
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
                    <h1 className="text-2xl font-bold mb-4 text-center">HR Admin Accounts</h1>
                    <p className="text-base mb-4 text-start">
                        The following is the list of all registered HR admin accounts.<br />
                        Please contact <strong>IT team</strong> to update the name or job title.
                    </p>

                    <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse rounded-lg overflow-hidden shadow-md">
                        <thead className="bg-[#8294C4] text-white">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Email</th>
                                <th className="px-6 py-3 font-semibold">First Name</th>
                                <th className="px-6 py-3 font-semibold">Last Name</th>
                                <th className="px-6 py-3 font-semibold">Job Title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hrstaff.length === 0 ? (
                                <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500">
                                    No HR Admin found!
                                </td>
                                </tr>
                            ) : (
                                hrstaff.map((hr, idx) => (
                                <tr
                                    key={hr.id}
                                    className={`transition-colors ${
                                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-[#DBDFEA]`}
                                >
                                    <td className="px-6 py-3 text-gray-700">{hr.email}</td>
                                    <td className="px-6 py-3 text-gray-700">{hr.first_name}</td>
                                    <td className="px-6 py-3 text-gray-700">{hr.last_name}</td>
                                    <td className="px-6 py-3 text-gray-700">{hr.job_title}</td>
                                </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default HRAdminManagement;
