import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";

function EmployeeManagement() {
    const [currentUser, setCurrentUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        if (user?.role === "HR" && user?.access) {  
            fetchEmployees(user.access);
        }
    }, []);


    const fetchEmployees = async (token) => {
        try {
            const res = await axios.get("http://localhost:8000/api/employees/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) fetchEmployees(newToken); 
            } else {
                console.error("Failed to fetch employees:", err);
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

    const handleEdit = (employee) => {
        setEditingId(employee.id);
        setFormData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            job_title: employee.job_title,
        });
    };

    const handleSave = async (id) => {
        if (!currentUser) return; 

        const sendUpdate = async (token) => {
            try {
                const res = await axios.put(
                    `http://localhost:8000/api/employees/${id}/`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setEmployees(employees.map(emp => emp.id === id ? res.data : emp));
                setEditingId(null);

            } catch (err) {
                if (err.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) await sendUpdate(newToken);
                } else {
                    console.error("Failed to update employee:", err.response || err);
                }
            }
        }
        await sendUpdate(currentUser.access);
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
                    <h1 className="text-2xl font-bold mb-4 text-center">Employee Management</h1>
                    <p className="text-base mb-4 text-start">
                        The following is the list of all registered employees.<br />
                        Please click <strong>edit</strong> to update the name or job title.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse rounded-lg overflow-hidden shadow-md">
                            <thead className="bg-[#8294C4] text-white">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Email</th>
                                    <th className="px-6 py-3 font-semibold">First Name</th>
                                    <th className="px-6 py-3 font-semibold">Last Name</th>
                                    <th className="px-6 py-3 font-semibold">Job Title</th>
                                    <th className="px-6 py-3 font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-6 text-gray-500">
                                            No employees found
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map((emp, idx) => (
                                        <tr
                                            key={emp.id}
                                            className={`transition-colors ${
                                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            } hover:bg-[#DBDFEA]`}
                                        >
                                            <td className="px-6 py-3">{emp.email}</td>
                                            <td className="px-6 py-3">
                                                {editingId === emp.id ? (
                                                    <input
                                                        name="first_name"
                                                        value={formData.first_name}
                                                        onChange={handleChange}
                                                        className="border rounded px-2 py-1 w-full"
                                                    />
                                                ) : emp.first_name}
                                            </td>
                                            <td className="px-6 py-3">
                                                {editingId === emp.id ? (
                                                    <input
                                                        name="last_name"
                                                        value={formData.last_name}
                                                        onChange={handleChange}
                                                        className="border rounded px-2 py-1 w-full"
                                                    />
                                                ) : emp.last_name}
                                            </td>
                                            <td className="px-6 py-3">
                                                {editingId === emp.id ? (
                                                    <input
                                                        name="job_title"
                                                        value={formData.job_title}
                                                        onChange={handleChange}
                                                        className="border rounded px-2 py-1 w-full"
                                                    />
                                                ) : emp.job_title}
                                            </td>
                                            <td className="px-6 py-3 flex justify-center">
                                                {editingId === emp.id ? (
                                                    <button
                                                        onClick={() => handleSave(emp.id)}
                                                        className="px-3 py-1 bg-[#8ABB6C] hover:bg-[#819067] text-white rounded-lg text-sm font-medium"
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEdit(emp)}
                                                        className="px-3 py-1 bg-[#F08B51] hover:bg-[#BB6653] text-white rounded-lg text-sm font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
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

export default EmployeeManagement;
