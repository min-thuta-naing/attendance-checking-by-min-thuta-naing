import React from "react";
import { useNavigate } from "react-router-dom";
import Employee from "../assets/employee.png"; 
import Admin from "../assets/user-setting.png";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full random-gradient-bg space-y-10">
        <p className="text-8xl font-extrabold">Z</p>
        <p className="text-5xl font-bold">COMPANY</p>
        <p className="text-2xl font-semibold">Logged in as:</p>

        <div className="flex gap-5">
            <div
                onClick={() => navigate("/login")}
                className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg p-4 w-40 h-40 hover:scale-105 transition"
            >
                <img
                    src={Employee} 
                    alt="Employee"
                    className="w-20 h-20 object-cover"
                />
                <p className="mt-2 text-lg font-medium">Employee</p>
            </div>

            <div
                onClick={() => navigate("/hrlogin")}
                className="cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg p-4 w-40 h-40 hover:scale-105 transition"
            >
                <img
                    src={Admin} 
                    alt="HR Admin"
                    className="w-20 h-20 object-cover"
                />
                <p className="mt-2 text-lg font-medium">HR Admin</p>
            </div>
        </div>
    </div>
  );
}

export default Welcome;
