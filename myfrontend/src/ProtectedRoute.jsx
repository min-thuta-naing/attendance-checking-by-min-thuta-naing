import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // redirect the user to the welcome page if they are not logged in 
    // for example if HR access the /home of employee, it redirect HR user to welcome page instead of /hr-dashboard cuz HR admin is not logged in 
    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    // if the user logged in + but accessing page from different role --> redirect back to their respective home 
    // for example if HR access the /home of employee, it redirect HR user to their home which is /hr-dashboard 
    if (!allowedRoles.includes(currentUser.role)) {
        return currentUser.role === "HR" ? (
            <Navigate to="/hr-dashboard" replace />
        ) : (
            <Navigate to="/home" replace />
        );
    }

    return <Element />;
};

export default ProtectedRoute;
