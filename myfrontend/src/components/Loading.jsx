import { useNavigate } from "react-router-dom";
import sadImage from "../assets/sad.png";

function Loading({redirectButtonNav}) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate(redirectButtonNav);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFEFEF]">
            <img src={sadImage} alt="Loading" className="w-48 h-48 mb-6" />
            <p className="mb-4 text-3xl font-semibold">Sorry</p>
            <p className="mb-4 text-lg font-semibold">You need to log in first!</p>
            <button
                onClick={handleLogin}
                className="btn-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go to Login
            </button>
        </div>
    );
}

export default Loading;