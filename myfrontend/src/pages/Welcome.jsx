import React from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full random-gradient-bg space-y-6">
      <h1 className="text-2xl font-bold">Logged in as:</h1>
      
      <div className="flex gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => navigate("/login")}
        >
          Employee
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => navigate("/hrlogin")}
        >
          HR Admin
        </button>
      </div>
    </div>
  );
}

export default Welcome;
