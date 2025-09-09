import { useState } from "react";
import axios from "axios";
import PasswordInputComponent from "../../components/PasswordInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${BASE_URL}/api/login/employee/`, {
                email,
                password,
            });

            // here save the user info of logged in user and JWT tokens 
            const data = response.data || {};
            const currentUser = {
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                job_title: data.job_title,
                role: data.role,
                access: data.access,
                refresh: data.refresh,
                branch_id: data.branch_id ?? (data.branch ? data.branch.id : null),
            };
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            console.log("Login successful:", response.data);
            navigate("/home"); 

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full random-gradient-bg">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back!
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <EmailInputComponent value={email} onChange={(e) => setEmail(e.target.value)} />
                    <PasswordInputComponent
                        value={password}
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        toggleShowPassword={() => setShowPassword(!showPassword)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full font-medium btn-primary"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
