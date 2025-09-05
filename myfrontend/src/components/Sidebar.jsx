import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserIcon, ArrowRightOnRectangleIcon, HomeIcon, UsersIcon, Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Sidebar({ currentUser }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/hrlogin");
    };

    const menuItems = [
        { name: "Dashboard", icon: <HomeIcon className="h-5 w-5 text-black" />, path: "/hr-dashboard" },
        { name: "Employees", icon: <UsersIcon className="h-5 w-5 text-black" />, path: "/hr-emp-mgmt" },
    ];

    return (
        <>
            {!isSidebarOpen && (
                <div className="sm:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="circle-btn flex justify-center items-center p-2 bg-[#ACB1D6] shadow-md"
                    >
                        <Bars4Icon className="h-6 w-6 text-black" />
                    </button>

                </div>
            )}

            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-[#ACB1D6] shadow-md flex flex-col p-6 transform transition-transform z-40
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 sm:static sm:h-screen sm:w-64`}
            >
                {/* Close button only on mobile */}
                <div className="sm:hidden flex justify-end mb-6">
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-4 right-4 circle-btn flex justify-center items-center bg-[#DBDFEA] shadow-md"
                    >
                        <XMarkIcon className="h-8 w-6 text-black" />
                    </button>
                </div>

                <div className="mb-8 mt-9">
                    <div className="flex items-center space-x-3 mb-4">
                        <UserIcon className="h-10 w-10 text-black" />
                        <div>
                            <p className="font-bold text-black">{currentUser?.first_name || "...."}</p>
                            <p className="text-black text-sm">{currentUser?.job_title || "...."}</p>
                        </div>
                    </div>
                    <hr className="border-gray-600" />
                </div>

                <nav className="flex-1">
                    <ul className="space-y-3">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsSidebarOpen(false); // close mobile sidebar after click
                                }}
                                className={`flex items-center space-x-3 cursor-pointer p-2 rounded 
                                    ${location.pathname === item.path ? "bg-[#DBDFEA]" : "hover:bg-[#DBDFEA]"} `}
                            >
                                {item.icon}
                                <span className="text-black">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-[#AF3E3E] rounded hover:bg-[#DBDFEA] transition"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Optional: semi-transparent overlay when sidebar is open on mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}

export default Sidebar;
