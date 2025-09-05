// import { useState } from "react";
// import PasswordInputComponent from "../../components/PasswordInputComponent";
// import EmailInputComponent from "../../components/EmailInputComponent";


// function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false); // new state


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Email:", email, "Password:", password);
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen w-full random-gradient-bg">
//             <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
//                 <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//                     Welcome Back!
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                     <EmailInputComponent/>
//                     <PasswordInputComponent/>

//                     <button
//                         type="submit"
//                         className="w-full font-medium btn-primary"
//                     >
//                         Sign In
//                     </button>
//                 </form>

//                 <p className="text-center text-sm text-gray-600 mt-4">
//                     Don’t have an account?{" "}
//                     <a href="/signup" className="text-blue-600 hover:underline">
//                         Sign up
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Login; 

import { useState } from "react";
import axios from "axios";
import PasswordInputComponent from "../../components/PasswordInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";
import { useNavigate } from "react-router-dom";

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
            const response = await axios.post("http://localhost:8000/api/login/employee/", {
                email,
                password,
            });

            // Save the logged-in user in localStorage
            localStorage.setItem("currentUser", JSON.stringify(response.data));

            console.log("Login successful:", response.data);
            console.log("Logged in user:", response.data);

            // Redirect to dashboard
            // window.location.href = "/home";
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
                        onChange={(e) => setPassword(e.target.value)}
                        showPassword={showPassword}
                        toggleShowPassword={() => setShowPassword(!showPassword)}
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full font-medium btn-primary"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
