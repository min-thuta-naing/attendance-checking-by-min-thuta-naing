import { useState } from "react";
import PasswordInputComponent from "../../components/PasswordInputComponent";
import EmailInputComponent from "../../components/EmailInputComponent";


function HRLogin() {
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
                    HR Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <EmailInputComponent/>
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

export default HRLogin; 