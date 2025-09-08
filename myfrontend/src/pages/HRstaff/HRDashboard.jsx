import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon, UserIcon, ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import axios from "axios";
import { useToast } from "../../contexts/ToastContext";

function HRAttendanceHistory() {
    const [currentUser, setCurrentUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [filters, setFilters] = useState({ start_date: "", end_date: "", session: "", branch: "" });
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user || user.role != "HR") {
            navigate("/login");
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        showToast("You have logged out successfully", "success");
        navigate("/hrlogin");
    };

    // to format the date & time
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        const [hour, minute] = timeStr.split(":");
        const d = new Date();
        d.setHours(hour, minute);
        return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    // to refresh the access token 
    const refreshAccessToken = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser?.refresh) return null;

        try {
            const res = await axios.post("http://localhost:8000/api/token/refresh/", { refresh: currentUser.refresh });
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

    const fetchAttendance = async (token) => {
        try {
            const params = {};
            Object.keys(filters).forEach((k) => { if (filters[k]) params[k] = filters[k]; });

            const res = await axios.get("http://localhost:8000/api/hr/attendance/", {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            setAttendance(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) await fetchAttendance(newToken);
            } else {
                console.error("Error fetching attendance:", err);
            }
        }
    };

    useEffect(() => {
        if (currentUser) fetchAttendance(currentUser.access);
    }, [currentUser, filters]);


    if (!currentUser) return <Loading redirectButtonNav="/" />;

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar currentUser={currentUser} />
            <div className="sm:ml-64 p-6 pt-20 overflow-y-auto h-screen">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-6xl mx-auto">
                    <h1 className="text-xl text-center font-bold mb-4">All Employees Attendance History</h1>

                    {/* filters */}
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <p className="flex justify-center items-center">from</p>
                            <input 
                                type="date" 
                                value={filters.start_date} 
                                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })} 
                                className="p-2 border rounded-xl" 
                                placeholder="Start Date" 
                            />
                            <p className="flex justify-center items-center">to</p>
                            <input 
                                type="date" 
                                value={filters.end_date} 
                                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })} 
                                className="p-2 border rounded-xl" 
                                placeholder="End Date" 
                            />
                        </div>
                        
                        <div className="flex flex-wrap gap-4">
                            <select value={filters.session} onChange={(e) => setFilters({ ...filters, session: e.target.value })} className="p-2 border rounded-xl">
                                <option value="">All Sessions</option>
                                <option value="Morning">Morning</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Afternoon">Afternoon</option>
                                <option value="Evening">Evening</option>
                            </select>
                            <input 
                                type="text" 
                                value={filters.branch} 
                                onChange={(e) => setFilters({ ...filters, branch: e.target.value })} 
                                className="p-2 border rounded-xl" 
                                placeholder="Branch" 
                            />
                            <input 
                                type="text" 
                                value={filters.email} 
                                onChange={(e) => setFilters({ ...filters, email: e.target.value })} 
                                className="p-2 border rounded-xl" 
                                placeholder="Email"
                            />

                        </div>
                            
                    </div>

                    {/* display table in bigger screen */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left border-collapse shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-[#8294C4]">
                                <tr>
                                    <th className="p-3 text-sm font-semibold text-white">Employee</th>
                                    <th className="p-3 text-sm font-semibold text-white">Branch</th>
                                    <th className="p-3 text-sm font-semibold text-white">Date</th>
                                    <th className="p-3 text-sm font-semibold text-white">Session</th>
                                    <th className="p-3 text-sm font-semibold text-white">Clock In</th>
                                    <th className="p-3 text-sm font-semibold text-white">Clock Out</th>
                                    <th className="p-3 text-sm font-semibold text-white">Verified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center p-4 text-gray-500">No records found</td>
                                    </tr>
                                ) : (
                                    attendance.map((a) => (
                                        <tr key={a.id} className="border-t bg-white hover:bg-[#B8C0E0] transition-colors">
                                            <td className="p-3 text-sm">{a.employee_email}</td>
                                            <td className="p-3 text-sm">{a.branch_name}</td>
                                            <td className="p-3 text-sm">{formatDate(a.date)}</td>
                                            <td className="p-3 text-sm">{a.session}</td>
                                            <td className="p-3 text-sm">{formatTime(a.clock_in_time)}</td>
                                            <td className="p-3 text-sm">{formatTime(a.clock_out_time)}</td>
                                            <td className="p-3 text-sm flex justify-center">
                                                {a.verified ? (
                                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                ) : (
                                                    <XCircleIcon className="h-6 w-6 text-red-500" />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* display card view for small screens */}
                    <div className="sm:hidden flex flex-col gap-4 mt-4">
                        {attendance.length === 0 ? (
                            <div className="text-center p-4">No records found</div>
                        ) : (
                            attendance.map((a) => (
                                <div key={a.id} className="bg-gray-50 border rounded-lg p-4 shadow-sm flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Employee:</span>
                                        <span>{a.employee_email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Branch:</span>
                                        <span>{a.branch_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Date:</span>
                                        <span>{formatDate(a.date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Session:</span>
                                        <span>{a.session}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Clock In:</span>
                                        <span>{formatTime(a.clock_in_time)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Clock Out:</span>
                                        <span>{formatTime(a.clock_out_time)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Verified:</span>
                                        {a.verified ? (
                                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-6 w-6 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HRAttendanceHistory;
