import React, { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { UserIcon, ArrowRightOnRectangleIcon, ClockIcon, PencilIcon, VideoCameraIcon, CameraIcon } from "@heroicons/react/24/outline";
import Loading from "../../components/Loading";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmation from "../../components/LogoutConfirmation";

function Home() {
    const [currentUser, setCurrentUser] = useState(null);
    const [session, setSession] = useState("MORNING");
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const [cameraOn, setCameraOn] = useState(false);
    const {showToast} = useToast();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        setCurrentUser(user);

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };

    }, []);

    const handleCameraToggle = async () => {
        if (cameraOn) {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
            setCameraOn(false);
            streamRef.current = null;
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play()
                            .then(() => setCameraOn(true))
                            .catch(err => {
                                console.error("Error playing video:", err);
                                showToast("Cannot play video stream", "error");
                            });
                    };
                }
            } catch (err) {
                console.error("Camera access denied:", err);
                showToast("Camera access denied. Please allow camera permissions.", "error");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        showToast("You have logged out successfully", "success");
        navigate("/login");
    };

    // to allow refresh the access token 
    const refreshAccessToken = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user?.refresh) return null;

        try {
            const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: user.refresh }),
            });

            if (!res.ok) throw new Error("Failed to refresh token");
            const data = await res.json();

            const updatedUser = { ...user, access: data.access };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            return data.access;
        } catch (err) {
            console.error("Token refresh failed:", err);
            showToast("Session expired. Please login again.", "error");
            localStorage.removeItem("currentUser");
            navigate("/login");
            return null;
        }
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        emp_latitude: pos.coords.latitude,
                        emp_longitude: pos.coords.longitude,
                    });
                },
                (err) => reject(err)
            );
        });
    };


    const handleAttendance = async (type) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            if (!currentUser) return navigate("/login");


            if (!cameraOn || !videoRef.current) {
                showToast("Please turn on the camera before proceeding", "error");
                return;
            }
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const face_image = canvas.toDataURL("image/jpeg");

            if (!face_image) {
                showToast("Face not captured. Try again.", "error");
                return;
            }

            //get location
            const location = await getLocation().catch(() => {
                showToast("Location permission is required for attendance. Please allow location access.", "error");
                throw new Error ("Location denied.");
            });

            const payload = {
                branch: currentUser.branch_id,
                session,
                emp_latitude: location.emp_latitude,
                emp_longitude: location.emp_longitude,
                face_image
            };

            console.log("Attendance payload:", payload);

            let token = currentUser.access;
            let response = await fetch(`http://127.0.0.1:8000/api/attendance/${type}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 401) {
                token = await refreshAccessToken();
                if (!token) throw new Error("Unable to refresh token");
                const updated = JSON.parse(localStorage.getItem("currentUser"));
                response = await fetch(`http://127.0.0.1:8000/api/attendance/${type}/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ...payload, branch: updated.branch_id }),
                });
            }

            const data = await response.json();
            if (!response.ok) {
                console.error("Attendance error body:", data);
                showToast(data.error || "Something went wrong", "error");
                return;
            }

            showToast(`${type === "clock-in" ? "Clock In" : "Clock Out"} Successful!`, "success");
        } catch (error) {
            console.error(error);
            showToast("Failed to submit attendance", "error");
        }
    };


    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen pt-25 random-gradient-bg flex flex-col items-center justify-center p-3">
            <Header
                title="Z Company"
                menuItems={[
                    {label: "Profile", icon: <UserIcon className="h-6 w-6" />, onClick: () => navigate("/profile")},
                    {label: "Attendance History", icon: <ClockIcon className="h-6 w-6" />, onClick: () => navigate("/emp-attendance-history")},
                    {label: "Change Password", icon: <PencilIcon className="h-6 w-6" />, onClick: () => navigate("/change-password")},
                    {label: "Log Out", icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />, onClick: () => setShowLogoutConfirm(true)},
                ]}
            />
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Welcome back, {currentUser.first_name || "-"} {currentUser.last_name || "-"}
                </h1>

                <div className="flex flex-col items-center mb-4">
                    <div className="relative w-80 h-60 bg-gray-200 rounded-lg overflow-hidden border">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`}
                        />
                        {!cameraOn && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                                <VideoCameraIcon className="w-10 h-10" />
                                <p>Camera Off</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleCameraToggle}
                        className="btn-primary mt-2 w-48 flex items-center justify-center mx-auto bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                        <CameraIcon className="w-5 h-5 mr-2" />
                        {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
                    </button>
                    <p className="text-sm text-gray-500 mt-2">Adjust your face and lighting before clicking Clock In</p>
                </div>


                <select
                    className="border rounded-lg px-3 py-2 w-full mb-4"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                >
                    <option value="MORNING">Morning</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="AFTERNOON">Afternoon</option>
                    <option value="EVENING">Evening</option>
                </select>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => handleAttendance("clock-in")}
                        className="btn-third px-4 py-2 rounded-lg shadow-lg"
                    >
                        Clock In
                    </button>
                    <button
                        onClick={() => handleAttendance("clock-out")}
                        className="btn-fourth px-4 py-2 rounded-lg shadow-lg"
                    >
                        Clock Out
                    </button>
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

export default Home;
