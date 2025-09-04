// import { Link, useNavigate } from 'react-router-dom';

// export default function Login() {
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // Dummy login logic
//     navigate('/home');
//   }

//   return (
//     <div className="container">
//       <h1>Login</h1>
//       <form onSubmit={handleLogin}>
//         <input type="email" placeholder="Email" required /><br/>
//         <input type="password" placeholder="Password" required /><br/>
//         <button type="submit">Login</button>
//       </form>
//       <p>Don't have an account? <Link to="/signup">Signup</Link></p>
//     </div>
//   )
// }

import { useState } from "react";
import { EyeIcon,EyeSlashIcon } from '@heroicons/react/24/outline'
import PasswordInputComponent from "../../components/PasswordInputComponent";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // new state


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full random-gradient-bg">
            <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Welcome Back!
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#A2AADB] focus:outline-none"
                            required
                        />
                    </div> */}

                    <PasswordInputComponent/>

                    <button
                        type="submit"
                        className="w-full font-medium btn-primary"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login; 