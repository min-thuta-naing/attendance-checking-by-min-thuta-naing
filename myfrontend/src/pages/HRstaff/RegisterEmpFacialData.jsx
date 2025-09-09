import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useToast } from "../../contexts/ToastContext";
import { CameraIcon, XMarkIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import BASE_URL from "../../api";

function RegisterEmpFacialData() {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [cameraOn, setCameraOn] = useState(false);
    const [capturedImages, setCapturedImages] = useState([null, null, null]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    // to refresh the access token when it is expired 
    const refreshAccessToken = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user?.refresh) return null;

        try {
            const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
                refresh: user.refresh,
            });
            const updatedUser = { ...user, access: res.data.access };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            return res.data.access;
        } catch (err) {
            localStorage.removeItem("currentUser");
            navigate("/hrlogin");
            return null;
        }
    };

    const fetchEmployee = async (token) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/employee/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployee(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                const newToken = await refreshAccessToken();
                if (newToken) await fetchEmployee(newToken);
            } else {
                console.error(err);
                showToast("Failed to fetch employee data", "error");
            }
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return navigate("/hrlogin");
        setCurrentUser(user);
        fetchEmployee(user.access);

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [id, navigate]);

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
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        width: { ideal: 300 }, 
                        height: { ideal: 400 },
                        facingMode: "user" 
                    },
                });
                
                streamRef.current = stream;
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play()
                            .then(() => {
                                setCameraOn(true);
                            })
                            .catch(err => {
                                console.error("Error playing video:", err);
                                showToast("Cannot play video stream", "error");
                            });
                    };
                }
            } catch (err) {
                console.error("Cannot access camera:", err);
                showToast("Cannot access camera. Please check permissions.", "error");
            }
        }
    };

    const handleCapture = (index) => {
        if (!videoRef.current || !canvasRef.current) {
            showToast("Camera not ready", "error");
            return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            showToast("Video not ready yet, try again", "error");
            return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        try {
            const imgData = canvas.toDataURL("image/jpeg");
            const newImages = [...capturedImages];
            newImages[index] = imgData;
            setCapturedImages(newImages);
        } catch (err) {
            console.error("Error capturing image:", err);
            showToast("Failed to capture image", "error");
        }
    };

    const handleRemove = (index) => {
        const newImages = [...capturedImages];
        newImages[index] = null;
        setCapturedImages(newImages);
    };

    // to convert base64 to Blob
    const dataURLtoBlob = (dataurl) => {
        if (!dataurl) return null;
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    };

    const handleSubmit = async () => {
        if (!currentUser) {
            showToast("Please log in again", "error");
            return;
        }
        
        if (capturedImages.some(img => !img)) {
            showToast("Please capture all 3 photos before submitting", "error");
            return;
        }

        const formData = new FormData();
        formData.append("employee", id);
        
        capturedImages.forEach((img, i) => {
            const blob = dataURLtoBlob(img);
            if (blob) {
                formData.append("images", blob, `capture_${i}.jpg`);
            }
        });

        const sendRequest = async (token) => {
            try {
                await axios.post(`${BASE_URL}/api/face-data/register/`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "multipart/form-data" 
                    },
                });
                showToast("Employee photos uploaded successfully!", "success");
                navigate("/hr-dashboard");
            } catch (err) {
                if (err.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) await sendRequest(newToken);
                } else {
                    console.error(err);
                    showToast("Failed to upload facial data", "error");
                }
            }
        };

        await sendRequest(currentUser.access);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar currentUser={currentUser} />
            <div className="sm:ml-64 flex items-center justify-center min-h-screen p-6 pt-18 pb-18">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                    <h2 className="text-xl font-bold mb-6">Register Facial Data</h2>
                    {employee && (
                        <p className="mb-4 text-gray-700">
                            Adding registration photo for <strong>{employee.first_name} {employee.last_name}</strong>
                        </p>
                    )}

                    {/*video frame feed displayed*/}
                    <div className="mb-4">
                        <div className="relative w-72 h-96 mx-auto bg-gray-200 rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${cameraOn ? '' : 'hidden'}`}
                            />
                            {!cameraOn && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <VideoCameraIcon className="w-12 h-12 text-gray-500" />
                                    <span className="mt-2 text-gray-500">Camera off</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleCameraToggle}
                            className="btn-third mt-2 w-48 flex items-center justify-center mx-auto bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 mb-4">
                        {capturedImages.map((img, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="relative w-27 h-39 border rounded overflow-hidden bg-gray-100">
                                    {img ? (
                                        <>
                                            <img src={img} alt={`capture_${i}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => handleRemove(i)}
                                                className="absolute top-1 left-1 bg-white rounded-full p-1 shadow"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-red-600" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            Blank
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleCapture(i)}
                                    disabled={!cameraOn}
                                    className="mt-2 w-24 bg-[#a2badb] text-black py-1 rounded hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition"
                                >
                                    Capture
                                </button>
                            </div>
                        ))}
                    </div>

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    <button
                        onClick={handleSubmit}
                        className="btn-primary mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Submit All Photos
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterEmpFacialData;