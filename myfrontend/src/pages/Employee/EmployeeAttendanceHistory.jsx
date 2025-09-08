import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { ArrowLeftIcon, XCircleIcon, CheckCircleIcon, UserIcon, HomeIcon, ArrowRightOnRectangleIcon, PencilIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import axios from "axios";
import {useToast} from "../../contexts/ToastContext";
import LogoutConfirmation from "../../components/LogoutConfirmation";
import BASE_URL from "../../api";

function EmployeeAttendanceHistory() {
    const [currentUser, setCurrentUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 
    const navigate = useNavigate();
    const {showToast} = useToast(); 

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        showToast("You have logged out successfully", "success");
        navigate("/login");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        const [hour, minute] = timeStr.split(":");
        const d = new Date();
        d.setHours(hour, minute);
        return d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;
        setCurrentUser(user);
    }, []);

    const refreshAccessToken = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser?.refresh) return null;

        try {
            const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
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

    useEffect(() => {
        if (!currentUser) return;

        const fetchAttendance = async (token) => {
            try {
                const res = await axios.get(`${BASE_URL}/api/attendance/my/`, {
                    headers: { Authorization: `Bearer ${token}` },
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

        fetchAttendance(currentUser.access);
    }, [currentUser]);

    if (!currentUser) {
        return <Loading redirectButtonNav="/" />;
    }

    return (
        <div className="min-h-screen pt-20 random-gradient-bg flex flex-col items-center justify-center p-6">
            <Header
                backNavigation
                title="Attendance History"
                menuItems={[
                    {label: "Go to Home", icon: <HomeIcon className="h-6 w-6" />, onClick: () => navigate("/home")},
                    {label: "Profile", icon: <UserIcon className="h-6 w-6" />, onClick: () => navigate("/profile")},
                    {label: "Change Password", icon: <PencilIcon className="h-6 w-6" />, onClick: () => navigate("/change-password")},
                    {label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: () => setShowLogoutConfirm(true)},
                ]}
            />
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
                <h1 className="text-xl font-bold mb-4">Your Attendance History</h1>

                {/*displaying table on bigger screen*/}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-[#8294C4]">
                            <tr>
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
                                <td colSpan="5" className="text-center p-4 text-gray-500">No records found</td>
                                </tr>
                            ) : (
                                attendance.map((a, index) => (
                                <tr
                                    key={a.id}
                                    className={`border-t ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    } hover:bg-[#B8C0E0] transition-colors`}
                                >
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


                {/*displaying cards style on smaller screen*/}
                <div className="sm:hidden flex flex-col gap-4">
                    {attendance.length === 0 ? (
                        <div className="text-center p-4">No records found</div>
                    ) : (
                        attendance.map((a) => (
                        <div
                            key={a.id}
                            className="bg-gray-50 border rounded-lg p-4 shadow-sm flex flex-col gap-2"
                        >
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

export default EmployeeAttendanceHistory;
