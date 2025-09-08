import React, {useEffect, useState} from "react";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import FirstNameInputComponent from "../../components/FirstNameInputComponent";
import LastNameInputComponent from "../../components/LastNameInputComponent";
import JobTitleInputComponent from "../../components/JobTitleInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useToast} from "../../contexts/ToastContext";

function RegisterEmployee() {
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        job_title: "",
        email: "",
        branch: null,
    });
    const [branches, setBranches] = useState([]);
    const [message, setMessage] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();
    const {showToast} = useToast(); 

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return;
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const fetchBranches = async () => {
            try {
                const token = currentUser.access;
                const res = await axios.get("http://localhost:8000/api/branches/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBranches(res.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (!newToken) return;
                    const res = await axios.get("http://localhost:8000/api/branches/", {
                        headers: { Authorization: `Bearer ${newToken}` }
                    });
                    setBranches(res.data);
                } else {
                    console.error("Failed to fetch branches:", err);
                }
            }
        };
        fetchBranches();
    }, [currentUser]);


    // to refresh a new access token when it is expired 
    const refreshAccessToken = async () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser.refresh) return null;

        try {
            const res = await axios.post("http://localhost:8000/api/token/refresh/", {
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


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            job_title: formData.job_title,
            role: "EMPLOYEE",
            branch: parseInt(formData.branch, 10)
        };

        const sendRequest = async (token) => {
            try {
                const res = await axios.post(
                    "http://localhost:8000/api/employees/register/",
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const employee = res.data; 

                showToast("Employee registered successfully!", "success");
                setFormData({
                    first_name: "",
                    last_name: "",
                    job_title: "",
                    email: "",
                    role: "EMPLOYEE",
                    branch: null,
                });

                navigate(`/hr-register-emp/${employee.id}/facial-data`);

            } catch (err) {
                if (err.response?.status === 401) {
                    const newToken = await refreshAccessToken();
                    if (newToken) await sendRequest(newToken);
                } else {
                    const errorMsg = err.response?.data?.error || "Failed to register employee. Try again!";
                    showToast(errorMsg, "error");
                    console.error(err);
                }
            }
        }

        await sendRequest(currentUser.access);
    };

    if (!currentUser) {
        return (
            <Loading redirectButtonNav="/" />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar currentUser={currentUser} />
            <div className="sm:ml-64 flex items-center justify-center min-h-screen p-6 pt-20">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
                    <h2 className="text-xl font-bold mb-6">Register New Employee</h2>

                    {message && <p className="text-sm mb-4 text-red-500">{message}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <FirstNameInputComponent
                            value={formData.first_name}
                            onChange={handleChange}
                            name="first_name"
                        />
                        <LastNameInputComponent
                            value={formData.last_name}
                            onChange={handleChange}
                            name="last_name"
                        />
                        <JobTitleInputComponent
                            value={formData.job_title}
                            onChange={handleChange}
                            name="job_title"
                        />
                        <EmailInputComponent
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                        />

                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                            Branch
                        </label>
                        <select
                            name="branch"
                            value={formData.branch || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        >
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>

                        <div className="text-sm text-gray-700 mb-4">
                            The default password is <strong>Default@123</strong>. Please inform the employee to change it later.
                        </div>


                        <button
                            type="submit"
                            className="btn-primary w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Register Employee
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default RegisterEmployee;
