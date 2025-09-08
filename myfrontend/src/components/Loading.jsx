import { useNavigate } from "react-router-dom";
import sadImage from "../assets/sad.png";

function Loading({redirectButtonNav}) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate(redirectButtonNav);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFEFEF]">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-6"></div>
            <p className="mb-4 text-3xl font-semibold">Loading ...</p>
            <p className="mb-4 text-lg font-semibold">You need to check the internet or try login again.</p>
            <button
                onClick={handleLogin}
                className="btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go back to login
            </button>
        </div>
    );
}

export default Loading;